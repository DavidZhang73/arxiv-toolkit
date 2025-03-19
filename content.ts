import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

export const config: PlasmoCSConfig = {
  matches: ["https://arxiv.org/*"]
}

const storage = new Storage()

window.addEventListener("load", async () => {
  const highlightEnabled =
    (await storage.get<boolean>("highlight-enabled")) ?? true
  const hideBlacklistEnabled =
    (await storage.get<boolean>("hide-blacklist-enabled")) ?? true
  const titleWhiteList = await storage.get<string>("title-whitelist")
  const authorWhiteList = await storage.get<string>("author-whitelist")
  const commentWhiteList = await storage.get<string>("comment-whitelist")
  const blackList = await storage.get<string>("blacklist")

  console.log("Highlight Enabled:", highlightEnabled)
  console.log("Hide Blacklist Enabled:", hideBlacklistEnabled)
  console.log("Title WhiteList:", titleWhiteList)
  console.log("Author WhiteList:", authorWhiteList)
  console.log("Comment WhiteList:", commentWhiteList)
  console.log("Blacklist:", blackList)

  if (highlightEnabled) {
    const ddElements = document.querySelectorAll("dd")

    ddElements.forEach((dd) => {
      const titleElement = dd.querySelector(".list-title")
      const authorElement = dd.querySelector(".list-authors")
      const commentElement = dd.querySelector(".list-comments")

      if (titleElement && titleWhiteList) {
        const titleKeywords = titleWhiteList.split(",")
        titleKeywords.forEach((keyword) => {
          const regex = new RegExp(`(${keyword})`, "gi")
          titleElement.innerHTML = titleElement.innerHTML.replace(
            regex,
            `<span style="background-color: yellow;">$1</span>`
          )
        })
      }

      if (authorElement && authorWhiteList) {
        const authorKeywords = authorWhiteList.split(",")
        authorKeywords.forEach((keyword) => {
          const regex = new RegExp(`(${keyword})`, "gi")
          authorElement.innerHTML = authorElement.innerHTML.replace(
            regex,
            `<span style="background-color: yellow;">$1</span>`
          )
        })
      }

      if (commentElement && commentWhiteList) {
        const commentKeywords = commentWhiteList.split(",")
        commentKeywords.forEach((keyword) => {
          const regex = new RegExp(`(${keyword})`, "gi")
          commentElement.innerHTML = commentElement.innerHTML.replace(
            regex,
            `<span style="background-color: yellow;">$1</span>`
          )
        })
      }
    })
  }

  if (hideBlacklistEnabled) {
    const blacklistKeywords = blackList.split(",")
    const ddElements = document.querySelectorAll("dd")

    ddElements.forEach((dd) => {
      const titleElement = dd.querySelector(".list-title")
      const authorElement = dd.querySelector(".list-authors")
      const commentElement = dd.querySelector(".list-comments")

      let isBlacklisted = false

        ;[titleElement, authorElement, commentElement].forEach((element) => {
          if (element) {
            blacklistKeywords.forEach((keyword) => {
              const regex = new RegExp(`(${keyword})`, "gi")
              if (regex.test(element.textContent || "")) {
                isBlacklisted = true
              }
            })
          }
        })

      if (isBlacklisted) {
        dd.style.opacity = "0.3"
        dd.style.filter = "grayscale(100%)"

        // 处理 dd 对应的 dt 元素
        const dt = dd.previousElementSibling as HTMLElement
        if (dt && dt.tagName.toLowerCase() === "dt") {
          dt.style.opacity = "0.3"
          dt.style.filter = "grayscale(100%)"
        }
      }
    })
  }
})
