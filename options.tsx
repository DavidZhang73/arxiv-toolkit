import {
  Anchor,
  Center,
  ColorInput,
  Divider,
  MantineProvider,
  Paper,
  Switch,
  Text
} from "@mantine/core"
import { IconBrandGithub, IconCheck, IconX } from "@tabler/icons-react"

import { useStorage } from "@plasmohq/storage/hook"

import { useRegexStorage } from "~utils"

import "@mantine/core/styles.css"
import "style.css"

import RegexList from "regex-list"

function IndexOptions() {
  const [highlightEnabled, setHighlightEnabled] = useStorage<boolean>(
    "highlight-enabled",
    true
  )
  const [highlightColor, setHighlightColor] = useStorage<string>(
    "highlight-color",
    "#4deb29"
  )
  const [hideBlacklistEnabled, setHideBlacklistEnabled] = useStorage<boolean>(
    "hide-blacklist-enabled",
    true
  )
  const [groupingEnabled, setGroupingEnabled] = useStorage<boolean>(
    "grouping-enabled",
    true
  )

  const [titleWhitelist, setTitleWhitelist] = useRegexStorage(
    "title-whitelist",
    [/(video)/gi]
  )
  const [authorWhitelist, setAuthorWhitelist] = useRegexStorage(
    "author-whitelist",
    [/(Kaiming He)/gi]
  )
  const [commentWhitelist, setCommentWhitelist] = useRegexStorage(
    "comment-whitelist",
    [/(accept)/gi]
  )

  const [blacklist, setBlacklist] = useRegexStorage("blacklist", [/(mamba)/gi])

  return (
    <MantineProvider>
      <Center>
        <Paper shadow="md" withBorder p="xl" mt="xl" w={600}>
          <Text
            size="xl"
            style={{
              display: "flex",
              alignItems: "center"
            }}>
            ArXiv Toolkit
            <Anchor
              ml="sm"
              href="https://github.com/DavidZhang73/arxiv-toolkit"
              target="_blank"
              style={{ display: "flex", alignItems: "center" }}>
              <IconBrandGithub size={24} color="black" />
            </Anchor>
          </Text>
          <Divider my="md" />
          <Switch
            label="Whitelist Highlighting"
            description="Highlight entries matching whitelist rules"
            checked={highlightEnabled}
            onChange={(event) =>
              setHighlightEnabled(event.currentTarget.checked)
            }
            thumbIcon={
              highlightEnabled ? (
                <IconCheck
                  size={12}
                  color="var(--mantine-color-teal-6)"
                  stroke={3}
                />
              ) : (
                <IconX
                  size={12}
                  color="var(--mantine-color-red-6)"
                  stroke={3}
                />
              )
            }
            mt="md"
          />
          <Switch
            label="Blacklist Dimming"
            description="De-emphasize entries matching whitelist rules"
            checked={hideBlacklistEnabled}
            onChange={(event) =>
              setHideBlacklistEnabled(event.currentTarget.checked)
            }
            thumbIcon={
              hideBlacklistEnabled ? (
                <IconCheck
                  size={12}
                  color="var(--mantine-color-teal-6)"
                  stroke={3}
                />
              ) : (
                <IconX
                  size={12}
                  color="var(--mantine-color-red-6)"
                  stroke={3}
                />
              )
            }
            mt="md"
          />
          <Switch
            label="Grouping"
            description="Enable grouping of entries by whitelist and blacklist rules"
            checked={groupingEnabled}
            onChange={(event) =>
              setGroupingEnabled(event.currentTarget.checked)
            }
            thumbIcon={
              groupingEnabled ? (
                <IconCheck
                  size={12}
                  color="var(--mantine-color-teal-6)"
                  stroke={3}
                />
              ) : (
                <IconX
                  size={12}
                  color="var(--mantine-color-red-6)"
                  stroke={3}
                />
              )
            }
            mt="md"
          />
          <ColorInput
            classNames={{
              input: "code"
            }}
            label="Highlight Color"
            description="Color used to highlight entries matching whitelist rules"
            placeholder="Hex color"
            value={highlightColor}
            onChangeEnd={(color) => setHighlightColor(color)}
            swatches={["#4deb29", "#ffff00"]}
            mt="md"
          />
          <Text size="sm" fw={600} mt="md">
            Title Whitelist
          </Text>
          <Text size="xs" c="rgb(134, 142, 150)">
            Matches keywords in the paper title. e.g.,{" "}
            <span className="code">video</span>,{" "}
            <span className="code">\sMRI\s</span>
          </Text>
          <RegexList
            regexList={titleWhitelist}
            onChange={(list) => setTitleWhitelist(list)}
          />
          <Text size="sm" fw={600} mt="md">
            Author Whitelist
          </Text>
          <Text size="xs" c="rgb(134, 142, 150)">
            Matches the author name. e.g.,{" "}
            <span className="code">Kaiming He</span>,{" "}
            <span className="code">Yann LeCun</span>
          </Text>
          <RegexList
            regexList={authorWhitelist}
            onChange={(list) => setAuthorWhitelist(list)}
          />
          <Text size="sm" fw={600} mt="md">
            Comment Whitelist
          </Text>
          <Text size="xs" c="rgb(134, 142, 150)">
            Matches content in the paper comment. e.g.,{" "}
            <span className="code">accept</span>,{" "}
            <span className="code">cvpr</span>,{" "}
            <span className="code">oral</span>
          </Text>
          <RegexList
            regexList={commentWhitelist}
            onChange={(list) => setCommentWhitelist(list)}
          />
          <Text size="sm" fw={600} mt="md">
            Blacklist
          </Text>
          <Text size="xs" c="rgb(134, 142, 150)">
            Matches title, author, or comment; lower priority than whitelist.
            e.g., <span className="code">mamba</span>,{" "}
            <span className="code">GAN</span>
          </Text>
          <RegexList
            regexList={blacklist}
            onChange={(list) => setBlacklist(list)}
          />
          <Divider my="md" />
          <Text size="xs">
            CopyRight ©{" "}
            <Anchor href="https://davidz.cn" target="_blank">
              DavidZ
            </Anchor>
          </Text>
        </Paper>
      </Center>
    </MantineProvider>
  )
}

export default IndexOptions
