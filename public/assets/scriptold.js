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
  fetch("http://localhost:3005/api/users", {
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
  fetch("http://localhost:3005/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => res.json())
    .then((data) => {
      // Save the token in the local storage
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        token = data.token;

        alert("User Logged In successfully");

        // Fetch the posts list
        fetchPosts();

        // Hide the auth container and show the app container as we're now logged in
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
  fetch("http://localhost:3005/api/users/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  }).then(() => {
    // Clear the token from the local storage as we're now logged out
    localStorage.removeItem("authToken");
    token = null;
    document.getElementById("auth-container").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
  });
}

// Global variable for storing posts
let allPosts = [];

// Function to fetch posts and display them
function fetchPosts() {
  fetch("http://localhost:3005/api/posts", {
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
  fetch("http://localhost:3005/api/posts", {
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

// Function to filter posts by title
function filterPostsByTitle() {
  const selectedTitle = document.getElementById("title-filter").value;

  let filteredPosts = allPosts;

  // If a title is selected, filter posts by the title
  if (selectedTitle) {
    filteredPosts = allPosts.filter((post) =>
      post.title.toLowerCase().includes(selectedTitle.toLowerCase())
    );
  }

  // Display the filtered posts
  displayPosts(filteredPosts);
}

// Attach event listener to the dropdown
document
  .getElementById("title-filter")
  .addEventListener("change", filterPostsByTitle);

// Function to update a post
function updatePost(postId) {
  const newTitle = prompt("Enter new title:");
  const newContent = prompt("Enter new content:");
  if (newTitle && newContent) {
    fetch(`http://localhost:3005/api/posts/${postId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
      }),
    })
      .then((res) => res.json())
      .then((updatedPost) => {
        console.log("Post updated:", updatedPost);
        // After updating, refresh the posts list
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
    fetch(`http://localhost:3005/api/posts/${postId}`, {
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
