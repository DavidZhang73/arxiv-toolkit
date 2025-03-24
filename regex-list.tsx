import { useState, useRef, useEffect } from 'react'
import { Stack, TextInput, ActionIcon, Tooltip, Button, Divider } from '@mantine/core'
import { IconTrashX, IconPlus } from '@tabler/icons-react'

function parseRegexList(regexList: RegExp[]) {
    return regexList.map((regex) => ({
        value: regex.source.slice(1, -1),
        i: regex.flags.includes("i"),
        g: regex.flags.includes("g")
    }))
}

function toRegexStrings(list) {
    return list.filter(({ value }) => value.trim() !== '')
        .map(({ value, i, g }) => {
            const flags = `${i ? 'i' : ''}${g ? 'g' : ''}`
            return new RegExp(`(${value})`, flags)
        })
}

export default function RegexList({ regexList, onChange }) {
    const inputRefs = useRef([])

    const [_regexList, setRegexList] = useState(() => parseRegexList(regexList))

    useEffect(() => {
        setRegexList(parseRegexList(regexList))
    }, [regexList])

    const toggleFlag = (index, flag) => {
        setRegexList((prev) => {
            const next = [...prev]
            next[index][flag] = !next[index][flag]
            if (onChange) onChange(toRegexStrings(next))
            return next
        })
    }

    const updateValue = (index, newValue) => {
        setRegexList((prev) => {
            const next = [...prev]
            next[index].value = newValue
            return next
        })
    }

    const deleteRule = (index) => {
        setRegexList((prev) => {
            const next = prev.filter((_, i) => i !== index)
            if (onChange) onChange(toRegexStrings(next))
            return next
        })
    }

    const addRule = () => {
        const next = [..._regexList, { value: '', i: true, g: true }]
        setRegexList(next)

        setTimeout(() => {
            const lastInput = inputRefs.current[next.length - 1]
            if (lastInput) lastInput.focus()
        }, 0)
    }

    const handleBlur = () => {
        if (onChange) {
            const cleaned = _regexList.filter(({ value }) => value.trim() !== '')
            onChange(toRegexStrings(cleaned))
            setRegexList(cleaned)
        }
    }

    return (
        <Stack mt="md" gap="sm">
            {_regexList.map((regex, index) => (
                <TextInput
                    key={index}
                    value={regex.value}
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => updateValue(index, e.currentTarget.value)}
                    onBlur={handleBlur}
                    placeholder="Keyword or regular expression"
                    leftSection={
                        <strong>/</strong>
                    }
                    rightSectionWidth={90}
                    rightSection={
                        <ActionIcon.Group>
                            <Tooltip label="Case-insensitive">
                                <ActionIcon
                                    variant={regex.i ? 'light' : 'subtle'}
                                    onClick={() => toggleFlag(index, 'i')}
                                >
                                    <strong>/i</strong>
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Multiple matches">
                                <ActionIcon
                                    variant={regex.g ? 'light' : 'subtle'}
                                    onClick={() => toggleFlag(index, 'g')}
                                >
                                    <strong>/g</strong>
                                </ActionIcon>
                            </Tooltip>
                            <Tooltip label="Delete">
                                <ActionIcon
                                    variant="light"
                                    color="red"
                                    onClick={() => deleteRule(index)}
                                >
                                    <IconTrashX size={14} />
                                </ActionIcon>
                            </Tooltip>
                        </ActionIcon.Group>
                    }
                />
            ))}
            <Button fullWidth variant="default" onClick={addRule} leftSection={<IconPlus size={14} />}>
                Add Rule
            </Button>
        </Stack>
    )
}