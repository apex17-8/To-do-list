import { useState } from "react";
import { CheckCircle, Circle, Trash2 } from "lucide-react";

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  time?: string;
}

const TodoApp = () => {
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: "Complete online JavaScript course", completed: true, time: "3 hours left" },
    { id: 2, text: "Jog around the park 3x", completed: false },
    { id: 3, text: "10 minutes meditation", completed: false },
    { id: 4, text: "Read for 1 hour", completed: false },
    { id: 5, text: "Pick up groceries", completed: false },
    { id: 6, text: "Complete Todo App on Frontend Mentor", completed: false },
  ]);

  // Add Todo
  const addTodo = () => {
    if (inputValue.trim() === "") {
      alert("Please enter a todo!");
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setInputValue("");
  };

  // Toggle Todo completion
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete Todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Clear completed todos
  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  // Filter todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  // Stats
  const stats = {
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  // Drag and drop functionality
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.currentTarget.classList.add("opacity-50", "bg-gray-200");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedItem !== null && draggedItem !== index) {
      const newTodos = [...todos];
      const [movedItem] = newTodos.splice(draggedItem, 1);
      newTodos.splice(index, 0, movedItem);
      setTodos(newTodos);
    }
    setDraggedItem(null);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove("opacity-50", "bg-gray-200");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            📝 Todo App
          </h1>

          {/* Stats Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center border border-blue-100">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-100">
              <div className="text-2xl font-bold text-yellow-600">{stats.active}</div>
              <div className="text-sm text-gray-600">Active</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center border border-green-100">
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>

          {/* Input Section */}
          <div className="flex flex-col sm:flex-row gap-2 mb-6">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="Create a new todo..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            <button
              onClick={addTodo}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors duration-200 font-semibold text-lg"
            >
              Add Todo
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 justify-center">
            {(["all", "active", "completed"] as const).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={`px-4 py-2 rounded-lg transition-colors duration-200 capitalize font-medium ${
                  filter === filterType
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {filterType}
              </button>
            ))}
          </div>

          {/* Todo List */}
          <div className="space-y-3 mb-4">
            {filteredTodos.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-lg">
                {filter === "all" ? "No todos yet! Add one above." : `No ${filter} todos.`}
              </div>
            ) : (
              filteredTodos.map((todo, index) => (
                <div
                  key={todo.id}
                  draggable="true"
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-move border border-gray-200"
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0 text-gray-500 hover:text-purple-600 transition-colors duration-200"
                  >
                    {todo.completed ? (
                      <CheckCircle size={28} className="text-green-500" />
                    ) : (
                      <Circle size={28} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-lg ${
                        todo.completed
                          ? 'line-through text-gray-400'
                          : 'text-gray-800'
                      }`}
                    >
                      {todo.text}
                    </span>
                    {todo.time && (
                      <div className="text-sm text-gray-500 mt-1">{todo.time}</div>
                    )}
                  </div>

                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 text-red-400 hover:text-red-600 transition-colors duration-200 p-1"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Drag Hint */}
          <div className="text-center py-3 text-gray-500 text-sm border-t border-dashed border-gray-300 mb-4">
            Drag and drop to reorder list
          </div>

          {/* Clear Completed */}
          {stats.completed > 0 && (
            <div className="flex justify-center">
              <button
                onClick={clearCompleted}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium"
              >
                Clear Completed ({stats.completed})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;