document.addEventListener("DOMContentLoaded", function () {
  const chatHistory = [];  // Array to store the chat history

  document.getElementById("chatForm").onsubmit = async function (event) {
    event.preventDefault();  // Prevent form submission from reloading the page

    const question = document.getElementById("question").value;  // Get user's input
    const responseDiv = document.getElementById("response");  // Get the response container
    responseDiv.innerHTML = "Loading...";  // Display "Loading..." until the response arrives

    try {
      // Send the question to the /prompt endpoint
      const response = await fetch(`/prompt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json' // Add this line
          },
          body: JSON.stringify({
            'question': question,
            'history': chatHistory,
          })
        });
      const data = await response.json();

      let responseText = "";
      if (data.error) {
        responseText = `Error: ${data.error}`;
      } else {
        responseText = data.response;
      }

      // Update the chat history
      chatHistory.push({ role: "user", content: question });
      chatHistory.push({ role: "assistant", content: responseText });

      // Display the updated chat history
      updateChatHistory(chatHistory);

      // Clear the input field for the next question
      document.getElementById("question").value = "";

    } catch (err) {
      responseDiv.innerHTML = `<span class="error">Error: ${err.message}</span>`;
    }
  };

  // Function to update the chat history on the page
  function updateChatHistory(history) {
    const responseDiv = document.getElementById("response");
    responseDiv.innerHTML = "";  // Clear the current response area

    history.forEach(message => {
      const messageElement = document.createElement("div");
      messageElement.className = message.role;  // Add class for styling ("user" or "assistant")

      if (message.role === "user") {
        messageElement.innerHTML = `<strong>You:</strong> ${message.content}`;
      } else {
        messageElement.innerHTML = `<strong>Noah AI:</strong> ${message.content}`;
      }

      responseDiv.appendChild(messageElement);
    });
  }
});
