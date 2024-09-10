import React, { useState } from 'react';
import StarRatings from 'react-star-ratings';

const StarRating = ({ rating = 0, onRatingChange, starDimension = "24px", starSpacing = "2px", numberOfStars = 5 }) => {
    return (
        <StarRatings
            rating={rating}                        // 현재 별점 점수
            starRatedColor="gold"                  // 별점 색상
            numberOfStars={numberOfStars}          // 별점 개수
            starDimension={starDimension}          // 별의 크기
            starSpacing={starSpacing}              // 별 사이 간격
            changeRating={onRatingChange}          // 별점 변경 시 호출되는 함수
            name="rating"                          // 컴포넌트 이름
        />
    );
};

export default StarRating;
