// frontend_web/frontend/src/hooks/useCategories.js
import { useState, useEffect } from 'react'
import CategoryController from '../controllers/CategoryController'

const useCategories = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadCategories = async () => {
    setLoading(true)
    setError(null)

    CategoryController.getAllCategories(
      (data) => {
        setCategories(data)
        setLoading(false)
      },
      (err) => {
        setError(err)
        setLoading(false)
      }
    )
  }

  const createCategory = async (categoryData) => {
    return new Promise((resolve, reject) => {
      CategoryController.createCategory(
        categoryData,
        (data) => {
          loadCategories()
          resolve({ success: true, data })
        },
        (err) => {
          reject({ success: false, error: err })
        }
      )
    })
  }

  const deleteCategory = async (id) => {
    return new Promise((resolve, reject) => {
      CategoryController.deleteCategory(
        id,
        () => {
          loadCategories()
          resolve({ success: true })
        },
        (err) => {
          reject({ success: false, error: err })
        }
      )
    })
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return { categories, loading, error, loadCategories, createCategory, deleteCategory }
}

export default useCategories