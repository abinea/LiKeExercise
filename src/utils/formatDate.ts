export default function formatDate(str: String) {
  return new Date().toLocaleDateString().replaceAll("/", "-")
}
