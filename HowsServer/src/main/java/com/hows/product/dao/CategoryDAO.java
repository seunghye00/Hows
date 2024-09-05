package com.hows.product.dao;

import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.hows.product.dto.CategoryDTO;


@Repository
public class CategoryDAO {

    @Autowired
    private SqlSession mybatis;

    public List<CategoryDTO> categoryList() {
        return mybatis.selectList("Category.categoryList");
    }
}
