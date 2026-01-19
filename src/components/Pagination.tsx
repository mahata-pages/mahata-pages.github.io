import { Link, useLocation } from 'react-router-dom'
import './Pagination.css'

type PaginationProps = Readonly<{
  currentPage: number
  totalPages: number
}>

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const location = useLocation()
  
  if (totalPages <= 1) {
    return null
  }

  const getPageLink = (page: number) => {
    const params = new URLSearchParams(location.search)
    params.set('page', String(page))
    return `?${params.toString()}`
  }

  return (
    <nav className="pagination" aria-label="Pagination Navigation">
      <ul className="pagination-list">
        {currentPage > 1 && (
          <li className="pagination-item">
            <Link to={getPageLink(currentPage - 1)} className="pagination-link pagination-prev">
              ← Previous
            </Link>
          </li>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page} className="pagination-item">
            {page === currentPage ? (
              <span className="pagination-link pagination-current" aria-current="page">
                {page}
              </span>
            ) : (
              <Link to={getPageLink(page)} className="pagination-link">
                {page}
              </Link>
            )}
          </li>
        ))}

        {currentPage < totalPages && (
          <li className="pagination-item">
            <Link to={getPageLink(currentPage + 1)} className="pagination-link pagination-next">
              Next →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
