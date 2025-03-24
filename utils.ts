import { useStorage as useRawStorage } from "@plasmohq/storage/hook"

export function serializeRegexList(list: RegExp[]): string[] {
    return list.map((regex) => regex.toString())
}

export function deserializeRegexList(list: string[] = []): RegExp[] {
    return list.map((str) => {
        const match = str.match(/^\/(.+)\/([a-z]*)$/i)
        if (match) {
            const [, pattern, flags] = match
            return new RegExp(pattern, flags)
        } else {
            return new RegExp(str)
        }
    })
}

export function useRegexStorage(key: string, defaultValue: RegExp[] = []) {
    const [rawList, setRawList] = useRawStorage<string[]>(key, serializeRegexList(defaultValue))

    const parsedList = deserializeRegexList(rawList)

    const setParsedList = (newList: RegExp[]) => {
        setRawList(serializeRegexList(newList))
    }

    return [parsedList, setParsedList] as const
}