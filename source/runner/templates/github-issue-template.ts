import { DangerResults } from "../../dsl/DangerResults"
import { Violation } from "../../platforms/messaging/violation"
import { GitHubPRDSL } from "../../dsl/GitHubDSL"
/**
 * Converts a set of violations into a HTML table
 *
 * @param {string} name User facing title of table
 * @param {string} emoji Emoji name to show next to each item
 * @param {Violation[]} violations for table
 * @returns {string} HTML
 */
function table(name: string, emoji: string, violations: Array<Violation>): string {
  if (violations.length === 0) { return "" }
  return `
<table>
  <thead>
    <tr>
      <th width="50"></th>
      <th width="100%" data-danger-table="true">${name}</th>
    </tr>
  </thead>
  <tbody>${violations.map((v: Violation) => { return `<tr>
      <td>:${emoji}:</td>
      <td>${v.message}</td>
    </tr>
  ` }).join("\n")}</tbody>
</table>
`
}

/**
 * A template function for creating a GitHub issue comment from Danger Results
 * @param {DangerResults} results Data to work with
 * @returns {string} HTML
 */
export function template(results: DangerResults, signature: string): string {
  /* tslint:disable:max-line-length */
  return `
${table("Fails", "no_entry_sign", results.fails)}
${table("Warnings", "warning", results.warnings)}
${table("Messages", "book", results.messages)}
${results.markdowns.join("\n\n")}
<p align="right">
  ${signature}
</p>
`
  /* tslint:enable:max-line-length */
}

/**
 * A commit aware signature that shows made by Danger or whatever
 * @param {DangerResults} results Data to work with
 * @returns {string} the signature in markdown
 */
export function signature(pr: GitHubPRDSL): string {
  const url = '<a href="http://github.com/danger/danger-js/">dangerJS</a>'
  const isFork = pr.head.user.login !== pr.base.user.login
  if (isFork) {
    const forkLink = `[${pr.head.sha}](${pr.commits_url}/${pr.head.sha})`
    return `Generated by :no_entry_sign:${url} against ${forkLink}`
  } else {
    return `Generated by :no_entry_sign:${url} against ${pr.head.sha}`
  }
}