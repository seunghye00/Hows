package com.hows.product.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hows.product.dao.CategoryDAO;
import com.hows.product.dto.CategoryDTO;

@Service
public class CategoryService {
    @Autowired
    private CategoryDAO CategoryDAO;

    public List<CategoryDTO> categoryList() {
        return CategoryDAO.categoryList();
    }
}
