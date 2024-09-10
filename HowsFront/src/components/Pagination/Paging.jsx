import React from 'react'
import Pagination from 'react-js-pagination'
import './Paging.css'

export const Paging = ({ page, count, setPage, perpage }) => {
    return (
        <div>
            <Pagination
                activePage={page}
                itemsCountPerPage={perpage}
                totalItemsCount={count}
                pageRangeDisplayed={5}
                prevPageText={'<'}
                nextPageText={'>'}
                onChange={setPage}
            />
        </div>
    )
}
