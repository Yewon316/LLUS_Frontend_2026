export function categoryClass(category) {
  switch (category) {
    case "스터디":
      return "badge badge-study";
    case "프로젝트":
      return "badge badge-project";
    case "스포츠":
      return "badge badge-sports";
    case "취미":
      return "badge badge-hobby";
    default:
      return "badge";
  }
}
