export function formatDate(str: string) {
  return new Date(str).toLocaleDateString().replaceAll("/", "-")
}

export function formatTerm(term: string) {
  let [year1, year2, semester] = term.split("-")
  semester = semester === "1" ? "一" : "二"
  return `${year1}-${year2}学年 第${semester}学期`
}
