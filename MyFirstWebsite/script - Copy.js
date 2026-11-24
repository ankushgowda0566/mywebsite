// 1. Select the HTML elements using their ID attributes
const messageParagraph = document.getElementById("message");
const clickButton = document.getElementById("clickBtn");

// 2. Listen for a click event on the button
clickButton.addEventListener("click", function () {
    // 3. Update the text content of the paragraph
    messageParagraph.textContent = "Congratulations! Your JavaScript is working!";
});
