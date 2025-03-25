import type { PlasmoCSConfig } from "plasmo"

import { Storage } from "@plasmohq/storage"

import { deserializeRegexList } from "~utils"

export const config: PlasmoCSConfig = {
  matches: ["https://arxiv.org/*"]
}

const storage = new Storage()

window.addEventListener("load", async () => {
  /**
   * Load the settings
   */
  const highlightEnabled =
    (await storage.get<boolean>("highlight-enabled")) ?? true
  const highlightColor =
    (await storage.get<string>("highlight-color")) ?? "#4deb29"
  const hideBlacklistEnabled =
    (await storage.get<boolean>("hide-blacklist-enabled")) ?? true
  const groupingEnabled =
    (await storage.get<boolean>("grouping-enabled")) ?? true

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

  // DEBUG
  // console.log("Highlight Enabled:", highlightEnabled)
  // console.log("Hide Blacklist Enabled:", hideBlacklistEnabled)
  // console.log("Grouping Enabled:", groupingEnabled)
  // console.log("Highlight Color:", highlightColor)

  // console.log("Title Whitelist:", titleWhitelist)
  // console.log("Author Whitelist:", authorWhitelist)
  // console.log("Comment Whitelist:", commentWhitelist)
  // console.log("Blacklist:", blacklist)

  /**
   * Preprocess the papers
   */
  document.querySelectorAll("#articles").forEach((rootElement) => {
    const h3 = rootElement.querySelector("h3")

    const paperList = []
    const children = Array.from(rootElement.children)
    for (let i = 0; i < children.length; i++) {
      if (children[i].tagName === "DT") {
        const dt = children[i]
        const dd =
          children[i + 1] && children[i + 1].tagName === "DD"
            ? children[i + 1]
            : null
        if (dd) {
          paperList.push({ dt, dd })
          i++
        }
      }
    }

    /**
     * Filter the papers
     */
    for (let i = 0; i < paperList.length; i++) {
      let { dt, dd } = paperList[i]
      const titleElement = dd.querySelector(".list-title")
      const authorElement = dd.querySelector(".list-authors")
      const commentElement = dd.querySelector(".list-comments")

      let highlight = false
      let hide = false

      /**
       * Highlight the paper title
       */
      if (titleElement && titleWhitelist) {
        titleWhitelist.forEach((regex) => {
          if (highlight || regex.test(titleElement.innerHTML)) {
            highlight = true
            if (highlightEnabled) {
              titleElement.innerHTML = titleElement.innerHTML.replace(
                regex,
                `<span style="background-color: ${highlightColor}">$1</span>`
              )
            }
          }
        })
      }

      /**
       * Hide the paper author
       */
      if (authorElement && authorWhitelist) {
        authorWhitelist.forEach((regex) => {
          if (highlight || regex.test(authorElement.innerHTML)) {
            highlight = true
            if (highlightEnabled) {
              authorElement.innerHTML = authorElement.innerHTML.replace(
                regex,
                `<span style="background-color: ${highlightColor}">$1</span>`
              )
            }
          }
        })
      }

      /**
       * Hide the paper comment
       */
      if (commentElement && commentWhitelist) {
        commentWhitelist.forEach((regex) => {
          if (highlight || regex.test(commentElement.innerHTML)) {
            highlight = true
            if (highlightEnabled) {
              commentElement.innerHTML = commentElement.innerHTML.replace(
                regex,
                `<span style="background-color: ${highlightColor}">$1</span>`
              )
            }
          }
        })
      }

      /**
       * Hide the paper if it is blacklisted
       */
      if (blacklist) {
        ;[titleElement, authorElement, commentElement].forEach((element) => {
          if (element) {
            blacklist.forEach((regex) => {
              if (regex.test(element.textContent || "")) {
                hide = true
              }
            })
          }
        })

        if (highlight) hide = false

        // highlighting has higher priority than hiding
        if (hideBlacklistEnabled && hide) {
          dt.style.opacity = "0.3"
          dt.style.filter = "grayscale(100%)"
          dd.style.opacity = "0.3"
          dd.style.filter = "grayscale(100%)"
        }
      }

      paperList[i].highlight = highlight
      paperList[i].hide = hide
    }

    /**
     * Group the papers
     * highlighted --> not highlighted not hidden --> hidden
     */
    if (groupingEnabled) {
      const highlighted = paperList.filter((paper) => paper.highlight)
      const notHighlighted = paperList.filter(
        (paper) => !paper.highlight && !paper.hide
      )
      const hidden = paperList.filter((paper) => paper.hide)

      const newPaperList = [...highlighted, ...notHighlighted, ...hidden]

      rootElement.innerHTML = h3.outerHTML
      newPaperList.forEach(({ dt, dd }, index) => {
        if (index === 0) {
          const categoryTitleElement = document.createElement("h4")
          categoryTitleElement.innerHTML = `Highlighted (${highlighted.length})`
          rootElement.appendChild(categoryTitleElement)
        } else if (index === highlighted.length) {
          const categoryTitleElement = document.createElement("h4")
          categoryTitleElement.innerHTML = `Not Highlighted (${notHighlighted.length})`
          rootElement.appendChild(categoryTitleElement)
        } else if (index === highlighted.length + notHighlighted.length) {
          const categoryTitleElement = document.createElement("h4")
          categoryTitleElement.innerHTML = `Hidden (${hidden.length})`
          rootElement.appendChild(categoryTitleElement)
        }
        rootElement.appendChild(dt)
        rootElement.appendChild(dd)
      })
    }
  })
})
