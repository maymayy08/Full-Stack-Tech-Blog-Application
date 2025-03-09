// Function to update a post
function updatePost(postId) {
    const newTitle = prompt("Enter new title:");
    const newContent = prompt("Enter new content:");
    if (newTitle && newContent) {
      fetch(`https://full-stack-tech-blog-application-axt5.onrender.com/api/posts/${postId}`, { // Corrected to use backticks
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
      fetch(`https://full-stack-tech-blog-application-axt5.onrender.com/api/posts/${postId}`, { // Corrected to use backticks
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
  