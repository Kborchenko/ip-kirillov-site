export default function CategoryList({ as: List = "div", className = "", children, ...props }) {
  return <List className={`category-list ${className}`.trim()} {...props}>{children}</List>;
}
