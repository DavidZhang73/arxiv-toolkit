import {
    Paper,
    Text,
    MantineProvider,
    Switch,
    Center,
    Divider,
    ColorInput,
    Anchor,
} from "@mantine/core"
import { IconCheck, IconX, IconBrandGithubFilled } from '@tabler/icons-react'
import { useStorage } from "@plasmohq/storage/hook"
import { useRegexStorage } from "~utils"
import '@mantine/core/styles.css'

import RegexList from "regex-list"

function IndexOptions() {
    const [highlightEnabled, setHighlightEnabled] = useStorage<boolean>("highlight-enabled", true)
    const [highlightColor, setHighlightColor] = useStorage<string>("highlight-color", "#4deb29")
    const [hideBlacklistEnabled, setHideBlacklistEnabled] = useStorage<boolean>("hide-blacklist-enabled", true)
    const [groupingEnabled, setGroupingEnabled] = useStorage<boolean>("grouping-enabled", false)

    const [titleWhitelist, setTitleWhitelist] = useRegexStorage("title-whitelist", [/(video)/ig])
    const [authorWhitelist, setAuthorWhitelist] = useRegexStorage("author-whitelist", [/(Kaiming He)/ig])
    const [commentWhitelist, setCommentWhitelist] = useRegexStorage("comment-whitelist", [/(accept)/ig])

    const [blacklist, setBlacklist] = useRegexStorage("blacklist", [/(mamba)/ig])

    return (
        <MantineProvider>
            <Center>
                <Paper shadow="md" withBorder p="xl" mt="xl" w={600}>
                    <Text size="xl" fw={700} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        ArXiv Toolkit
                        <Anchor href="https://github.com/DavidZhang73/arxiv-toolkit" target="_blank" style={{ display: "flex", alignItems: "center" }}>
                            <IconBrandGithubFilled size={24} color="black" />
                        </Anchor>
                    </Text>
                    <Divider my="md" />
                    <Switch
                        label="Whitelist Highlighting"
                        description="Highlight entries matching whitelist rules"
                        checked={highlightEnabled}
                        onChange={(event) => setHighlightEnabled(event.currentTarget.checked)}
                        thumbIcon={
                            highlightEnabled ? (
                                <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
                            ) : (
                                <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
                            )
                        }
                        mt="md"
                    />
                    <Switch
                        label="Blacklist Dimming"
                        description="De-emphasize entries matching whitelist rules"
                        checked={hideBlacklistEnabled}
                        onChange={(event) => setHideBlacklistEnabled(event.currentTarget.checked)}
                        thumbIcon={
                            hideBlacklistEnabled ? (
                                <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
                            ) : (
                                <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
                            )
                        }
                        mt="md"
                    />
                    <Switch
                        label="Grouping"
                        description="Enable grouping of entries by whitelist and blacklist rules"
                        checked={groupingEnabled}
                        onChange={(event) => setGroupingEnabled(event.currentTarget.checked)}
                        thumbIcon={
                            groupingEnabled ? (
                                <IconCheck size={12} color="var(--mantine-color-teal-6)" stroke={3} />
                            ) : (
                                <IconX size={12} color="var(--mantine-color-red-6)" stroke={3} />
                            )
                        }
                        mt="md"
                    />
                    <ColorInput
                        label="Highlight Color"
                        description="Color used to highlight entries matching whitelist rules"
                        placeholder="Hex color"
                        value={highlightColor}
                        onChangeEnd={(color) => setHighlightColor(color)}
                        swatches={["#4deb29", "#ffff00"]}
                        mt="md"
                    />
                    <Text size="lg" fw={600} mt="md">Title Whitelist</Text>
                    <RegexList regexList={titleWhitelist} onChange={(list) => setTitleWhitelist(list)} />
                    <Text size="lg" fw={600} mt="md">Author Whitelist</Text>
                    <RegexList regexList={authorWhitelist} onChange={(list) => setAuthorWhitelist(list)} />
                    <Text size="lg" fw={600} mt="md">Comment Whitelist</Text>
                    <RegexList regexList={commentWhitelist} onChange={(list) => setCommentWhitelist(list)} />
                    <Text size="lg" fw={600} mt="md">Blacklist</Text>
                    <RegexList regexList={blacklist} onChange={(list) => setBlacklist(list)} />
                    <Divider my="md" />
                    <Text>CopyRight © <Anchor href="https://davidz.cn" target="_blank">DavidZ</Anchor></Text>
                </Paper>
            </Center>
        </MantineProvider>
    )
}

export default IndexOptions
