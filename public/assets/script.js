// Insert element from index
const logBtn = document.querySelector(".logbtn");
const regBtn = document.querySelector(".regbtn");
const formBx = document.querySelector(".formBx");
const body = document.querySelector("body");

// Buttons to direct to register and login
regBtn.onclick = function () {
  formBx.classList.add("active");
  body.classList.add("active");
};

logBtn.onclick = function () {
  formBx.classList.remove("active");
  body.classList.remove("active");
};

//Create token for local storage
let token = localStorage.getItem("authToken");

//Function to register users
function register() {
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  fetch("https://full-stack-tech-blog-application-axt5.onrender.com/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.errors) {
        alert(data.errors[0].message);
      } else {
        alert("User registered successfully");
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// Function for login users
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  fetch("https://full-stack-tech-blog-application-axt5.onrender.com/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        token = data.token;

        alert("User Logged In successfully");
        fetchPosts();
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("app-container").classList.remove("hidden");
      } else {
        alert(data.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

// Function to logout of blog page
function logout() {
  fetch("https://full-stack-tech-blog-application-axt5.onrender.com/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    localStorage.removeItem("authToken");
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}

let allPosts = [];

// Function to fetch posts and display them
function fetchPosts() {
  fetch("https://full-stack-tech-blog-application-axt5.onrender.com/api/posts", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((posts) => {
      allPosts = posts;
      displayPosts(posts);
    })
    .catch((error) => console.error("Error fetching posts:", error));
}

// Function to create posts
function createPost() {
  const title = document.getElementById("post-title").value;
  const content = document.getElementById("post-content").value;
  fetch("https://full-stack-tech-blog-application-axt5.onrender.com/api/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content, postedBy: "User" }),
  })
    .then((res) => res.json())
    .then(() => {
      alert("Post created successfully");
      fetchPosts();
    });
}

// Function to display posts on the page
function displayPosts(posts) {
  const postsContainer = document.getElementById("posts");
  postsContainer.innerHTML = ""; // Clear previous posts

  posts.forEach((post) => {
    const div = document.createElement("div");
    div.id = `post-${post.id}`;
    div.classList.add("post-container");

    const title = document.createElement("h3");
    title.textContent = post.title;
    title.classList.add("post-title");

    const content = document.createElement("p");
    content.textContent = post.content;
    content.classList.add("post-content");

    const postedBy = document.createElement("p");
    postedBy.textContent = `Posted by: ${post.postedBy}`;
    postedBy.classList.add("post-postedBy");

    const createdOn = document.createElement("p");
    createdOn.textContent = `Created on: ${new Date(
      post.createdOn
    ).toLocaleDateString()}`;
    createdOn.classList.add("post-createdOn");

    div.appendChild(title);
    div.appendChild(content);
    div.appendChild(postedBy);
    div.appendChild(createdOn);

    // Create Update Button for updating a post
    const updateButton = document.createElement("button");
    updateButton.textContent = "Update";
    updateButton.addEventListener("click", function () {
      updatePost(post.id); // Handle post update
    });
    div.appendChild(updateButton);

    // Create Delete Button for deleting a post
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      deletePost(post.id);
    });
    div.appendChild(deleteButton);

    postsContainer.appendChild(div);
  });
}

// Function to filter posts by title and content 
function filterPosts() {
    const filterInput = document.getElementById("filter-input");
    const filterText = filterInput.value.toLowerCase(); 
    
    let filteredPosts = allPosts;
    if (filterText) {
      filteredPosts = filteredPosts.filter((post) =>
        post.title.toLowerCase().includes(filterText) || post.content.toLowerCase().includes(filterText) || post.postedBy.toLowerCase().includes(filterText)
      );
    }
  
    // Display the filtered posts
    displayPosts(filteredPosts);
    filterInput.value = ''; 
  }
  
  document.getElementById("filter-input").addEventListener("keypress", function(event) {
    // Check if the pressed key is "Enter" (key code 13)
    if (event.key === "Enter") {
      filterPosts();
    }
  });

// Function to update a post
function updatePost(postId) {
  const newTitle = prompt("Enter new title:");
  const newContent = prompt("Enter new content:");
  const newPostedBy = prompt("Enter your name");
  if (newTitle && newContent && newPostedBy)  {
    fetch(`https://full-stack-tech-blog-application-axt5.onrender.com/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        postedBy: newPostedBy
      }),
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        console.log("Post updated:", updatedPost);
        fetchPosts();
      })
      .catch((err) => {
        console.error("Error updating post:", err);
      });
  }
}

// Function to delete a post
function deletePost(postId) {
  if (confirm("Are you sure you want to delete this post?")) {
    fetch(`https://full-stack-tech-blog-application-axt5.onrender.com/api/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete post.");
        }
        alert("Post deleted successfully.");
        allPosts = allPosts.filter((post) => post.id !== postId);
        displayPosts(allPosts);
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        alert(error.message || "An error occurred while deleting the post.");
      });
  }
}
