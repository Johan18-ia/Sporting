// src/hooks/useUsers.ts
// ====================================================
// HOOK: USUARIOS
// ====================================================
import { useState, useEffect, useCallback } from 'react'
import UserController from '../controllers/UserController'

interface User {
    id: number
    name: string
    lastname?: string
    email: string
    role: string
    phone?: string
    document?: string
    is_active?: number
    created_at?: string
    updated_at?: string
}

interface UseUsersReturn {
    users: User[]
    selectedUser: User | null
    loading: boolean
    error: string | null
    loadUsers: () => Promise<void>
    getUserById: (id: number) => Promise<void>
    createUser: (userData: any) => Promise<{ success: boolean; data?: any }>
    updateUser: (id: number, userData: any) => Promise<{ success: boolean; data?: any }>
    patchUser: (id: number, partialData: any) => Promise<{ success: boolean; data?: any }>
    deleteUser: (id: number) => Promise<{ success: boolean }>
    toggleUserStatus: (id: number, isActive: boolean) => Promise<{ success: boolean; data?: any }>
}

export const useUsers = (): UseUsersReturn => {
    const [users, setUsers] = useState<User[]>([])
    const [selectedUser, setSelectedUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    const loadUsers = useCallback(async () => {
        setLoading(true)
        setError(null)

        UserController.getAllUsers(
            (data: User[]) => {
                setUsers(data)
                setLoading(false)
            },
            (err: string) => {
                setError(err)
                setLoading(false)
            }
        )
    }, [])

    const getUserById = useCallback(async (id: number) => {
        setLoading(true)
        setError(null)

        return new Promise<void>((resolve) => {
            UserController.getUserById(
                id,
                (data: User) => {
                    setSelectedUser(data)
                    setLoading(false)
                    resolve()
                },
                (err: string) => {
                    setError(err)
                    setLoading(false)
                    resolve()
                }
            )
        })
    }, [])

    const createUser = useCallback(async (userData: any) => {
        return new Promise<{ success: boolean; data?: any }>((resolve, reject) => {
            UserController.createUser(
                userData,
                (data: any) => {
                    loadUsers()
                    resolve({ success: true, data })
                },
                (err: string) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }, [loadUsers])

    const updateUser = useCallback(async (id: number, userData: any) => {
        return new Promise<{ success: boolean; data?: any }>((resolve, reject) => {
            UserController.updateUser(
                id,
                userData,
                (data: any) => {
                    loadUsers()
                    resolve({ success: true, data })
                },
                (err: string) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }, [loadUsers])

    const patchUser = useCallback(async (id: number, partialData: any) => {
        return new Promise<{ success: boolean; data?: any }>((resolve, reject) => {
            UserController.patchUser(
                id,
                partialData,
                (data: any) => {
                    loadUsers()
                    resolve({ success: true, data })
                },
                (err: string) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }, [loadUsers])

    const deleteUser = useCallback(async (id: number) => {
        return new Promise<{ success: boolean }>((resolve, reject) => {
            UserController.deleteUser(
                id,
                () => {
                    loadUsers()
                    resolve({ success: true })
                },
                (err: string) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }, [loadUsers])

    const toggleUserStatus = useCallback(async (id: number, isActive: boolean) => {
        return new Promise<{ success: boolean; data?: any }>((resolve, reject) => {
            UserController.toggleUserStatus(
                id,
                isActive,
                (data: any) => {
                    loadUsers()
                    resolve({ success: true, data })
                },
                (err: string) => {
                    reject({ success: false, error: err })
                }
            )
        })
    }, [loadUsers])

    useEffect(() => {
        loadUsers()
    }, [loadUsers])

    return {
        users,
        selectedUser,
        loading,
        error,
        loadUsers,
        getUserById,
        createUser,
        updateUser,
        patchUser,
        deleteUser,
        toggleUserStatus
    }
}

export default useUsers