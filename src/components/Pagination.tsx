import { Link, useLocation } from 'react-router-dom'
import styles from './Pagination.module.css'

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
    <nav className={styles.pagination} aria-label="Pagination Navigation">
      <ul className={styles.paginationList}>
        {currentPage > 1 && (
          <li className={styles.paginationItem}>
            <Link to={getPageLink(currentPage - 1)} className={`${styles.paginationLink} ${styles.paginationPrev}`}>
              ← Previous
            </Link>
          </li>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <li key={page} className={styles.paginationItem}>
            {page === currentPage ? (
              <span className={`${styles.paginationLink} ${styles.paginationCurrent}`} aria-current="page">
                {page}
              </span>
            ) : (
              <Link to={getPageLink(page)} className={styles.paginationLink}>
                {page}
              </Link>
            )}
          </li>
        ))}

        {currentPage < totalPages && (
          <li className={styles.paginationItem}>
            <Link to={getPageLink(currentPage + 1)} className={`${styles.paginationLink} ${styles.paginationNext}`}>
              Next →
            </Link>
          </li>
        )}
      </ul>
    </nav>
  )
}
