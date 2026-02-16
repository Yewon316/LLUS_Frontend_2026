export function categoryClass(category) {
  switch (category) {
    case "Study":
      return "badge badge-study";
    case "Project":
      return "badge badge-project";
    case "Sports":
      return "badge badge-sports";
    case "Hobby":
      return "badge badge-hobby";
    default:
      return "badge";
  }
}
