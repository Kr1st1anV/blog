import React, { useState, useEffect } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([]);

  // Load posts from Local Storage on initial render
  useEffect(() => {
    const storedPosts = localStorage.getItem("blogPosts");
    if (storedPosts) {
      setPosts(JSON.parse(storedPosts));
    }
  }, []);

  // Save posts to Local Storage whenever it is updated
  useEffect(() => {
    localStorage.setItem("blogPosts", JSON.stringify(posts));
  }, [posts]);

  const handleLoginClick = (e) => {
    e.preventDefault();
    const username = e.target.elements.username.value;
    const password = e.target.elements.password.value;
    // Check the credentials (replace with your own logic)
    if (username === "admin" && password === "password") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid username or password.");
    }
  };

  const handleNewPostSubmit = (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      alert("Please login to create a post.");
      return;
    }
    if (newPostTitle.trim() === "" || newPostContent.trim() === "") {
      alert("Please enter a title and content.");
      return;
    }
    const newPost = {
      title: newPostTitle,
      content: newPostContent,
      comments: []
    };
    setPosts((prevPosts) => [...prevPosts, newPost]);
    setNewPostTitle("");
    setNewPostContent("");
  };

  const handlePostEdit = (index, updatedTitle, updatedContent) => {
    const updatedPosts = [...posts];
    updatedPosts[index].title = updatedTitle;
    updatedPosts[index].content = updatedContent;
    setPosts(updatedPosts);
  };

  const handlePostDelete = (index) => {
    if (!isLoggedIn) {
      alert("Please login to delete a post.");
      return;
    }
    const updatedPosts = [...posts];
    updatedPosts.splice(index, 1);
    setPosts(updatedPosts);
  };

  const handleNewCommentSubmit = (e, postId) => {
    e.preventDefault();
    const name = e.target.elements.name.value;
    const commentText = e.target.elements.commentText.value;
    if (name.trim() === "" || commentText.trim() === "") {
      alert("Please enter your name and comment.");
      return;
    }
    const newComment = { name, commentText, replies: [] };
    const updatedPosts = [...posts];
    updatedPosts[postId].comments.push(newComment);
    setPosts(updatedPosts);
    e.target.reset();
  };

  const handleNewReplySubmit = (e, postId, commentId) => {
    e.preventDefault();
    const name = e.target.elements.replyName.value;
    const replyText = e.target.elements.replyText.value;
    if (name.trim() === "" || replyText.trim() === "") {
      alert("Please enter your name and reply.");
      return;
    }
    const newReply = { name, replyText };
    const updatedPosts = [...posts];
    updatedPosts[postId].comments[commentId].replies.push(newReply);
    setPosts(updatedPosts);
    e.target.reset();
  };
  const renderReplies = (replies) => {
    return replies.map((reply, replyId) => (
      <div key={replyId} className="reply">
        <p>{reply.name}</p>
        <p>{reply.replyText}</p>
      </div>
    ));
  };

  const renderPosts = () => {
    return posts.map((post, index) => (
      <div key={index} className="post">
        <h2>{post.title}</h2>
        <p>{post.content}</p>
        <div className="comments">
          <h3>Comments</h3>
          {renderComments(post.comments, index)}
        </div>
        <div className="new-comment">
          <h4>Add a Comment</h4>
          <form onSubmit={(e) => handleNewCommentSubmit(e, index)}>
            <label htmlFor={`name_${index}`}>Name:</label>
            <input type="text" id={`name_${index}`} name="name" />
            <label htmlFor={`commentText_${index}`}>Comment:</label>
            <textarea id={`commentText_${index}`} name="commentText"></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
        <div className="edit-section">
          <h4>Edit Post</h4>
          <form
            onSubmit={(e) =>
              handlePostEdit(
                index,
                e.target.elements.editTitle.value,
                e.target.elements.editContent.value
              )
            }
          >
            <label htmlFor={`editTitle_${index}`}>Title:</label>
            <input
              type="text"
              id={`editTitle_${index}`}
              name="editTitle"
              defaultValue={post.title}
            />
            <label htmlFor={`editContent_${index}`}>Content:</label>
            <textarea
              id={`editContent_${index}`}
              name="editContent"
              defaultValue={post.content}
            ></textarea>
            <div className="edit-buttons">
              <button type="submit">Save</button>
              <button onClick={() => handlePostDelete(index)}>Delete</button>
            </div>
          </form>
        </div>
      </div>
    ));
  };

  const renderComments = (comments, postId) => {
    return comments.map((comment, commentId) => (
      <div key={commentId} className="comment">
        <p>{comment.name}</p>
        <p>{comment.commentText}</p>
        {comment.replies.length > 0 && (
          <div className="replies">
            <h5>Replies</h5>
            {renderReplies(comment.replies)}
          </div>
        )}
        <div className="reply-section">
          <h5>Add a Reply</h5>
          <form onSubmit={(e) => handleNewReplySubmit(e, postId, commentId)}>
            <label htmlFor={`replyName_${postId}_${commentId}`}>Name:</label>
            <input
              type="text"
              id={`replyName_${postId}_${commentId}`}
              name="replyName"
            />
            <label htmlFor={`replyText_${postId}_${commentId}`}>Reply:</label>
            <textarea
              id={`replyText_${postId}_${commentId}`}
              name="replyText"
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    ));
  };

  return (
    <div className="App">
      <header>
        <h1>Lulu's blog</h1>
      </header>
      <main id="blogPosts">{renderPosts()}</main>
      {!isLoggedIn && (
        <div className="admin-section">
          <h2>Admin Login</h2>
          <form onSubmit={handleLoginClick}>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" />
            <button type="submit">Login</button>
          </form>
        </div>
      )}
      {isLoggedIn && (
        <div className="new-post">
          <h2>Create a New Post</h2>
          <form onSubmit={handleNewPostSubmit}>
            <label htmlFor="newPostTitle">Title:</label>
            <input
              type="text"
              id="newPostTitle"
              name="newPostTitle"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
            />
            <label htmlFor="newPostContent">Content:</label>
            <textarea
              id="newPostContent"
              name="newPostContent"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
