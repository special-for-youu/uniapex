'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Plus, Trash2, CheckCircle2, Circle, Loader2, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Todo {
    id: string
    task: string
    is_completed: boolean
    created_at: string
    due_date?: string
}

export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([])
    const [newTask, setNewTask] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        fetchTodos()
    }, [])

    const fetchTodos = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('user_todos')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error
            setTodos(data || [])
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Error fetching todos:', error)
        } finally {
            setLoading(false)
        }
    }

    const addTodo = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTask.trim()) return

        setAdding(true)
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('user_todos')
                .insert({
                    user_id: user.id,
                    task: newTask.trim(),
                    is_completed: false,
                    due_date: dueDate || null
                })
                .select()
                .single()

            if (error) throw error

            setTodos([data, ...todos])
            setNewTask('')
            setDueDate('')
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Error adding todo:', error)
        } finally {
            setAdding(false)
        }
    }

    const toggleTodo = async (id: string, currentStatus: boolean) => {
        // Optimistic update
        setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t))

        try {
            const { error } = await supabase
                .from('user_todos')
                .update({ is_completed: !currentStatus })
                .eq('id', id)

            if (error) throw error
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Error toggling todo:', error)
            // Revert on error
            setTodos(todos.map(t => t.id === id ? { ...t, is_completed: currentStatus } : t))
        }
    }

    const deleteTodo = async (id: string) => {
        // Optimistic update
        const oldTodos = [...todos]
        setTodos(todos.filter(t => t.id !== id))

        try {
            const { error } = await supabase
                .from('user_todos')
                .delete()
                .eq('id', id)

            if (error) throw error
        } catch (error) {
            if (process.env.NODE_ENV === 'development') console.error('Error deleting todo:', error)
            setTodos(oldTodos)
        }
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    My Tasks
                </h3>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400">
                    {todos.filter(t => t.is_completed).length}/{todos.length} Done
                </span>
            </div>

            <form onSubmit={addTodo} className="mb-4 space-y-2">
                <div className="relative">
                    <input
                        type="text"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="Add a new task..."
                        className="w-full pl-4 pr-10 py-3 rounded-xl border bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        style={{ borderColor: 'var(--border-color)' }}
                    />
                    <button
                        type="submit"
                        disabled={adding || !newTask.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-500 text-white disabled:opacity-50 hover:bg-blue-600 transition-colors"
                    >
                        {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    </button>
                </div>
                <div className="relative">
                    <input
                        type="date"
                        lang="en-GB"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-500 dark:text-gray-400 dark:[color-scheme:dark]"
                        style={{ borderColor: 'var(--border-color)' }}
                    />
                </div>
            </form>

            <div className="flex-grow overflow-y-auto pr-2 space-y-2 custom-scrollbar max-h-[300px]">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : todos.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                        No tasks yet. Add one above!
                    </div>
                ) : (
                    <AnimatePresence initial={false}>
                        {todos.map(todo => (
                            <motion.div
                                key={todo.id}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className={`group flex items-center gap-3 p-3 rounded-xl border transition-all ${todo.is_completed
                                    ? 'bg-gray-50/50 dark:bg-white/5 border-transparent opacity-60'
                                    : 'bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 hover:border-blue-500/30'
                                    }`}
                            >
                                <button
                                    onClick={() => toggleTodo(todo.id, todo.is_completed)}
                                    className={`flex-shrink-0 transition-colors ${todo.is_completed ? 'text-green-500' : 'text-gray-300 hover:text-blue-500'
                                        }`}
                                >
                                    {todo.is_completed ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <Circle className="w-5 h-5" />
                                    )}
                                </button>

                                <div className="flex-grow min-w-0">
                                    <span className={`block text-sm truncate ${todo.is_completed ? 'line-through text-gray-500' : ''
                                        }`}>
                                        {todo.task}
                                    </span>
                                    {todo.due_date && (
                                        <div className="flex items-center gap-1 mt-1 text-xs text-gray-400">
                                            <Calendar className="w-3 h-3" />
                                            <span>{new Date(todo.due_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => deleteTodo(todo.id)}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                )}
            </div>
        </div>
    )
}
