import { useStorage } from "@plasmohq/storage/hook"

function IndexOptions() {
    const [highlightEnabled, setHighlightEnabled] = useStorage<boolean>("highlight-enabled", true)
    const [hideBlacklistEnabled, setHideBlacklistEnabled] = useStorage<boolean>("hide-blacklist-enabled", true)
    const [titleWhitelist, setTitleWhitelist] = useStorage<string>("title-whitelist", "")
    const [authorWhitelist, setAuthorWhitelist] = useStorage<string>("author-whitelist", "")
    const [commentWhitelist, setCommentWhitelist] = useStorage<string>("comment-whitelist", "")
    const [blacklist, setBlacklist] = useStorage<string>("blacklist", "")

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center", // 水平居中
                paddingTop: 32 // 添加顶部间距
            }}>
            <div
                style={{
                    width: 800, // 固定宽度
                    padding: 16,
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // 添加阴影
                    borderRadius: 8, // 圆角
                    backgroundColor: "#fff" // 背景色
                }}>
                <h2>ArXiv Toolkit</h2>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={highlightEnabled}
                            onChange={(e) => setHighlightEnabled(e.target.checked)}
                        />
                        Enable Keyword Highlight
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={hideBlacklistEnabled}
                            onChange={(e) => setHideBlacklistEnabled(e.target.checked)}
                        />
                        Hide Blacklist Entries
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Title Whitelist:
                        <textarea
                            placeholder="Enter title whitelist keywords..."
                            defaultValue={titleWhitelist}
                            onBlur={(e) => setTitleWhitelist(e.target.value)}
                            style={{ width: "100%", height: 100, marginTop: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Author Whitelist:
                        <textarea
                            placeholder="Enter author whitelist keywords..."
                            defaultValue={authorWhitelist}
                            onBlur={(e) => setAuthorWhitelist(e.target.value)}
                            style={{ width: "100%", height: 100, marginTop: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Comment Whitelist:
                        <textarea
                            placeholder="Enter comment whitelist keywords..."
                            defaultValue={commentWhitelist}
                            onBlur={(e) => setCommentWhitelist(e.target.value)}
                            style={{ width: "100%", height: 100, marginTop: 8 }}
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Blacklist:
                        <textarea
                            placeholder="Enter blacklist keywords..."
                            defaultValue={blacklist}
                            onBlur={(e) => setBlacklist(e.target.value)}
                            style={{ width: "100%", height: 100, marginTop: 8 }}
                        />
                    </label>
                </div>
            </div>
        </div>
    )
}

export default IndexOptions