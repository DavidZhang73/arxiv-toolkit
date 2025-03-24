import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

import { deserializeRegexList } from "~utils"

export const config: PlasmoCSConfig = {
  matches: ["https://arxiv.org/*"]
}

const storage = new Storage()

function hexToRgb(hex) {
  hex = hex.replace(/^#/, "")

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("")
  }

  if (hex.length !== 6) {
    throw new Error("Invalid hex color: " + hex)
  }

  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255

  return { r, g, b }
}

window.addEventListener("load", async () => {
  const highlightEnabled =
    (await storage.get<boolean>("highlight-enabled")) ?? true
  const highlightColor =
    (await storage.get<string>("highlight-color")) ?? "#4deb29"
  const hideBlacklistEnabled =
    (await storage.get<boolean>("hide-blacklist-enabled")) ?? true
  const groupingEnabled =
    (await storage.get<boolean>("grouping-enabled")) ?? false

  const titleWhitelist = deserializeRegexList(
    (await storage.get<string[]>("title-whitelist")) ?? ["/(video)/ig"]
  )
  const authorWhitelist = deserializeRegexList(
    (await storage.get<string[]>("author-whitelist")) ?? ["/(Kaiming He)/ig"]
  )
  const commentWhitelist = deserializeRegexList(
    (await storage.get<string[]>("comment-whitelist")) ?? ["/(accept)/ig"]
  )
  const blacklist = deserializeRegexList(
    (await storage.get<string[]>("blacklist")) ?? ["/(mamba)/ig"]
  )

  console.log("Highlight Enabled:", highlightEnabled)
  console.log("Hide Blacklist Enabled:", hideBlacklistEnabled)
  console.log("Grouping Enabled:", groupingEnabled)
  console.log("Highlight Color:", highlightColor)

  console.log("Title Whitelist:", titleWhitelist)
  console.log("Author Whitelist:", authorWhitelist)
  console.log("Comment Whitelist:", commentWhitelist)
  console.log("Blacklist:", blacklist)

  if (highlightEnabled) {
    const ddElements = document.querySelectorAll("dd")

    ddElements.forEach((dd) => {
      const titleElement = dd.querySelector(".list-title")
      const authorElement = dd.querySelector(".list-authors")
      const commentElement = dd.querySelector(".list-comments")

      if (titleElement && titleWhitelist) {
        titleWhitelist.forEach((regex) => {
          titleElement.innerHTML = titleElement.innerHTML.replace(
            regex,
            `<span style="background-color: ${highlightColor}">$1</span>`
          )
        })
      }

      if (authorElement && authorWhitelist) {
        authorWhitelist.forEach((regex) => {
          authorElement.innerHTML = authorElement.innerHTML.replace(
            regex,
            `<span style="background-color: ${highlightColor}">$1</span>`
          )
        })
      }

      if (commentElement && commentWhitelist) {
        commentWhitelist.forEach((regex) => {
          commentElement.innerHTML = commentElement.innerHTML.replace(
            regex,
            `<span style="background-color: ${highlightColor}">$1</span>`
          )
        })
      }
    })
  }

  if (hideBlacklistEnabled) {
    const ddElements = document.querySelectorAll("dd")

    ddElements.forEach((dd) => {
      const titleElement = dd.querySelector(".list-title")
      const authorElement = dd.querySelector(".list-authors")
      const commentElement = dd.querySelector(".list-comments")

      let isBlacklisted = false

      ;[titleElement, authorElement, commentElement].forEach((element) => {
        if (element) {
          blacklist.forEach((regex) => {
            if (regex.test(element.textContent || "")) {
              isBlacklisted = true
            }
          })
        }
      })

      if (isBlacklisted) {
        dd.style.opacity = "0.3"
        dd.style.filter = "grayscale(100%)"

        const dt = dd.previousElementSibling as HTMLElement
        if (dt && dt.tagName.toLowerCase() === "dt") {
          dt.style.opacity = "0.3"
          dt.style.filter = "grayscale(100%)"
        }
      }
    })
  }
})
