
// These are all the categories
let categories = [
    { title: "Personal",  img:"girl.png" },
    { title: "Work",      img: "briefcase.png" },
    { title: "Shopping",  img: "shopping.png" },
    { title: "Health",    img:"healthcare.png" },
    { title: "Fitness",   img:"dumbbell.png" },
    { title: "Education", img: "education.png" },
    { title: "Finance",   img: "saving.png" },
  ];
  
  let tasks = [
    // Note: each task ties back to a category by name; case needs to match a category title
    { id: 1,  task: "Go to market",                                category: "Shopping",  completed: false },
    { id: 2,  task: "Read a chapter of a book",                    category: "Personal",  completed: false },
    { id: 3,  task: "Apply to 10 jobs today",                      category: "Work",      completed: false },
    { id: 4,  task: "Take a 30-minute walk after each meal",       category: "Health",    completed: false },
    { id: 5,  task: "Do 25 sit ups",                               category: "Fitness",   completed: false },
    { id: 6,  task: "Watch a HTML Video",                          category: "Education", completed: false },
    { id: 7,  task: "Review weekly budget",                        category: "Finance",   completed: false },
    { id: 8,  task: "Buy groceries for the week",                  category: "Shopping",  completed: false },
    { id: 9,  task: "Pay Wifi Bill",                               category: "Personal",  completed: false },
    { id: 10, task: "Check emails",                                category: "Work",      completed: false },
    { id: 11, task: "Try a new pasta recipe",                      category: "Health",    completed: false },
    { id: 12, task: "Sign up for a Pilates class",                 category: "Fitness",   completed: false },
    { id: 13, task: "Set up automatic credit card bill payments",  category: "Finance",   completed: false },
  ];
  
  
  // ====== localStorage helper functs ======
  // saveLocal: whenever tasks change, I persist them so the app remembers state across refreshes.
  const saveLocal = () => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  
  // getLocal: on load, I hydrate the in-memory `tasks` array from localStorage if available.
  const getLocal = () => {
    const tasksLocal = JSON.parse(localStorage.getItem("tasks"));
    if (tasksLocal) {
      tasks = tasksLocal;
    }
  };
  
  
  // ====== UI state helpers ======
  // Toggles the two-screen layout (home <-> category/all-tasks screen)
  const toggleScreen = () => {
    screenWrapper.classList.toggle("show-category");
  };
  
  // Updates only the "Today you have X tasks" number on the home header
  const updateHomeTotal = () => {
    totalTasks.innerHTML = tasks.length;
  };
  
  // Updates the category header counts and keeps the home total in sync too
  const updateTotals = () => {
    const categoryTasks = tasks.filter(
      (task) =>
        task.category.toLowerCase() === selectedCategory.title.toLowerCase()
    );
    numTasks.innerHTML = `${categoryTasks.length} Tasks`;
    updateHomeTotal(); // keep home header synced whenever I recompute totals
  };
  
  
  // ====== Date & Time (Home header) ======
  // updateTodayDate: renders a friendly, locale-aware date (e.g., "Wednesday, July 30, 2025")
  const updateTodayDate = () => {
    if (!todayDate) return; // safe guard if element not present in HTML
    const now = new Date();
    const formatted = new Intl.DateTimeFormat(
      navigator.language || undefined,
      { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }
    ).format(now);
    todayDate.textContent = formatted;
  };
  
  // scheduleMidnightRefresh: when the date changes at midnight, I update the label automatically
  const scheduleMidnightRefresh = () => {
    if (!todayDate) return;
    const now = new Date();
    const next = new Date(now);
    next.setHours(24, 0, 0, 0); // next local midnight
    const ms = next - now;
    setTimeout(() => {
      updateTodayDate();
      scheduleMidnightRefresh(); // schedule the next midnight tick
    }, ms);
  };
  
  // updateTodayTime: renders a live clock using the user's locale (12/24h automatically)
  const updateTodayTime = () => {
    if (!todayTime) return;
    const now = new Date();
    const formatted = new Intl.DateTimeFormat(
      navigator.language || undefined,
      { hour: 'numeric', minute: '2-digit', second: "2-digit" } // add { second: '2-digit' } if I want seconds
    ).format(now);
    todayTime.textContent = formatted;
  };
  
  
  // ====== Renderers ======
  // renderAllTasks: builds the "All Tasks" combined list UI and wires up handlers
  const renderAllTasks = () => {
    tasksContainer.innerHTML = "";
  
    // Keep the header counts fresh for this view
    numTasks.innerHTML = `${tasks.length} Tasks`;
    updateHomeTotal();
  
    if (tasks.length === 0) {
      tasksContainer.innerHTML = `<p class="no-tasks">No tasks added</p>`;
    } else {
      tasks.forEach((task) => {
        const div = document.createElement("div");
        div.classList.add("task-wrapper");
  
        // Left side: checkbox + task text
        const label = document.createElement("label");
        label.classList.add("task");
        label.setAttribute("for", task.id);
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = task.id;
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
          // Toggle completion for this task and persist
          const index = tasks.findIndex((t) => t.id === task.id);
          tasks[index].completed = !tasks[index].completed;
          saveLocal();
        });
  
        label.innerHTML = `
          <span class="checkmark">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
          </span>
          <p>${task.task}</p>
        `;
  
        label.prepend(checkbox);
        div.appendChild(label);
  
        // Right side: delete icon for the task
        div.innerHTML += `
          <div class="delete">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21
                    c.342.052.682.107 1.022.166m-1.022-.165L18.16
                    19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25
                    2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108
                    48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114
                    1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5
                    0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
                    51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09
                    2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/>
            </svg>
          </div>
        `;
  
        tasksContainer.appendChild(div);
  
        // Delete action: remove from array, persist, refresh counts and UI
        const deleteBtn = div.querySelector(".delete");
        deleteBtn.addEventListener("click", () => {
          const index = tasks.findIndex((t) => t.id === task.id);
          tasks.splice(index, 1);
          saveLocal();
          updateHomeTotal();
          renderAllTasks(); // re-render list + header totals
        });
      });
    }
  };
  
  // renderCategories: builds the category cards (home screen)
  const renderCategories = () => {
    categoriesContainer.innerHTML = "";
    categories.forEach((category) => {
      const categoryTasks = tasks.filter(
        (task) => task.category.toLowerCase() === category.title.toLowerCase()
      );
      const div = document.createElement("div");
      div.classList.add("category");
  
      // Card layout: left side (icon + title + count), right side (overflow menu icon)
      div.innerHTML = `
        <div class="left">
          <img src="images/${category.img}" alt="${category.title}" />
          <div class="content">
            <h1>${category.title}</h1>
            <p>${categoryTasks.length} Tasks</p>
          </div>
        </div>
        <div class="options">
          <div class="toggle-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 6.75a.75.75 0 110-1.5.75.75 0
                       010 1.5zM12 12.75a.75.75 0 110-1.5.75.75
                       0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75
                       0 010 1.5z"/>
            </svg>
          </div>
        </div>
      `;
  
      // Helper to open a category view (used by both the card and its options)
      const openCategory = () => {
        isAllTasksView = false;
        screenWrapper.classList.add("show-category");
        selectedCategory = category;
        updateTotals();
        categoryTitle.innerHTML = category.title;
        categoryImg.src = `images/${category.img}`;
        renderTasks();
      };
  
      // Clicking the left side of the card opens that category
      div.querySelector(".left").addEventListener("click", openCategory);
  
      // Clicking the options (⋮) does the same (I currently keep them in sync)
      div.querySelector(".toggle-btn").addEventListener("click", (e) => {
        e.stopPropagation();
        openCategory();
      });
  
      categoriesContainer.appendChild(div);
    });
  };
  
  // renderTasks: builds task list for the *selected* category
  const renderTasks = () => {
    tasksContainer.innerHTML = "";
    const categoryTasks = tasks.filter(
      (task) =>
        task.category.toLowerCase() === selectedCategory.title.toLowerCase()
    );
  
    // Keep header totals fresh for this view
    updateTotals();
  
    if (categoryTasks.length === 0) {
      tasksContainer.innerHTML = `<p class="no-tasks">No tasks added for this category</p>`;
    } else {
      categoryTasks.forEach((task) => {
        const div = document.createElement("div");
        div.classList.add("task-wrapper");
  
        const label = document.createElement("label");
        label.classList.add("task");
        label.setAttribute("for", task.id);
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = task.id;
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => {
          const index = tasks.findIndex((t) => t.id === task.id);
          tasks[index].completed = !tasks[index].completed;
          saveLocal();
        });
  
        label.innerHTML = `
          <span class="checkmark">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
          </span>
          <p>${task.task}</p>
        `;
        label.prepend(checkbox);
        div.appendChild(label);
  
        // Delete icon
        div.innerHTML += `
          <div class="delete">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24" stroke-width="1.5"
                 stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21
                         c.342.052.682.107 1.022.166m-1.022-.165L18.16
                         19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25
                         2.25 0 01-2.244-2.077L4.772 5.79m14.456
                         0a48.108 48.108 0 00-3.478-.397m-12
                         .562c.34-.059.68-.114 1.022-.165m0
                         0a48.11 48.11 0 013.478-.397m7.5
                         0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964
                         51.964 0 00-3.32 0c-1.18.037-2.09
                         1.022-2.09 2.201v.916m7.5 0a48.667
                         48.667 0 00-7.5 0"/>
            </svg>
          </div>
        `;
  
        tasksContainer.appendChild(div);
  
        // Delete action for a category task
        const deleteBtn = div.querySelector(".delete");
        deleteBtn.addEventListener("click", () => {
          const index = tasks.findIndex((t) => t.id === task.id);
          tasks.splice(index, 1);
          saveLocal();
          updateHomeTotal();
          renderTasks(); // refresh the category list
        });
      });
    }
  };
  
  
  // ====== Add Task UI ======
  // Toggle the add-task drawer/backdrop
  const toggleAddTaskForm = () => {
    addTaskWrapper.classList.toggle("active");
    blackBackdrop.classList.toggle("active");
    addTaskBtn.classList.toggle("active");
  };
  
  // addTask: creates a new task using the form values and updates the UI
  const addTask = (e) => {
    e.preventDefault();
    const task = taskInput.value;
    const category = categorySelect.value; // Note: value is title-cased to match categories
  
    if (task === "") {
      alert("Please enter a task");
    } else {
      const newTask = {
        id: tasks.length + 1, // naive id; ok for simple demo
        task,
        category,
        completed: false,
      };
      taskInput.value = "";
      tasks.push(newTask);
      saveLocal();
      toggleAddTaskForm();
      updateHomeTotal();
  
      // Re-render whichever view I'm currently in
      isAllTasksView ? renderAllTasks() : renderTasks();
    }
  };
  
  
  // ====== App state & DOM refs ======
  let selectedCategory = categories[0]; // which category is open (for category view)
  let isAllTasksView = false;           // true when "All Tasks" is open
  
  // Cached DOM pointers
  const categoriesContainer = document.querySelector(".categories");
  const screenWrapper = document.querySelector(".wrapper");
  const menuBtn = document.querySelector(".menu-btn");
  const backBtn = document.querySelector(".back-btn");
  const tasksContainer = document.querySelector(".tasks");
  const numTasks = document.getElementById("num-tasks");
  const categoryTitle = document.getElementById("category-title");
  const categoryImg = document.getElementById("category-img");
  const categorySelect = document.getElementById("category-select");
  const addTaskWrapper = document.querySelector(".add-task");
  const addTaskBtn = document.querySelector(".add-task-btn");
  const taskInput = document.getElementById("task-input");
  const blackBackdrop = document.querySelector(".black-backdrop");
  const addBtn = document.querySelector(".add-btn");
  const cancelBtn = document.querySelector(".cancel-btn");
  const totalTasks = document.getElementById("total-tasks");
  const todayDate = document.getElementById("today-date"); // optional: only if present in HTML
  const todayTime = document.getElementById("today-time"); // optional: only if present in HTML
  
  
  // ====== Events ======
  // Menu button → open the combined "All Tasks" view
  menuBtn.addEventListener("click", () => {
    isAllTasksView = true;
    screenWrapper.classList.add("show-category");
    categoryTitle.innerHTML = "All Tasks";
    categoryImg.src = "images/girl.png"; // neutral icon for the all-tasks header (optional)
    renderAllTasks();
  });
  
  // Back button → go back to the home screen
  backBtn.addEventListener("click", toggleScreen);
  
  // Add-task FAB + backdrop + form buttons
  addTaskBtn.addEventListener("click", toggleAddTaskForm);
  blackBackdrop.addEventListener("click", toggleAddTaskForm);
  addBtn.addEventListener("click", addTask);
  cancelBtn.addEventListener("click", toggleAddTaskForm);
  
  
  // ====== App init ======
  // 1) Load any saved tasks
  getLocal();
  
  // 2) Prime the home header (total + date/time)
  updateHomeTotal();
  updateTodayDate();
  scheduleMidnightRefresh();
  updateTodayTime();
  setInterval(updateTodayTime, 1000); // update time once per second
  
  // 3) Render home categories and default category view
  renderCategories();
  renderTasks();
  
  // 4) Populate the category dropdown in the Add Task form (title-cased to match filtering)
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.title;
    option.textContent = category.title;
    categorySelect.appendChild(option);
  });
  