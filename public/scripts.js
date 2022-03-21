const questionDiv = document.querySelector("#question");
const answerButtons = document.querySelectorAll("[data-option = answer]");
const goodAnswersSpan = document.querySelector("#good-answers");
const gameBoard = document.querySelector("#game-board");
const h2 = document.querySelector("h2");
const phoneAFriendButton = document.querySelector("#phone-a-friend");
const fiftyFiftyButton = document.querySelector("#fifty-fifty");
const askTheAudienceButton = document.querySelector("#ask-the-audience");
const tipDiv = document.querySelector("#tip");

phoneAFriendButton.addEventListener("click", phoneAFriend);
fiftyFiftyButton.addEventListener("click", fiftyFifty);
askTheAudienceButton.addEventListener("click", askTheAudience);
answerButtons.forEach((answer, index) => {
	answer.addEventListener("click", () => sendAnswer(index));
});

function handleAnswerFeedback(data) {
	goodAnswersSpan.textContent = data.goodAnswers;
	showNextQuestion();
}

function handleFriendsAnswer(data) {
	tipDiv.textContent = data.text;
}

function handleFiftyFiftyFeedback(data) {
	// console.log(data.hideAnswerIndex1);
	// console.log(data.hideAnswerIndex2);
	if (data.text) {
		tipDiv.textContent = data.text;
		return;
	}
	answerButtons[data.hideAnswerIndex1].classList.add("hide");
	answerButtons[data.hideAnswerIndex2].classList.add("hide");
}

function handleAskTheAudienceFeedback(data) {
	// console.log(data);
	if (data.text) {
		tipDiv.textContent = data.text;
		return;
	}
	tipDiv.innerHTML = "<p>Tak zagłosowała publiczność:</p>";
	data = JSON.parse(data);
	data.forEach((item) => {
		console.log(item);
		tipDiv.innerHTML += `<p> ${item.answer}: ${item.vote}%`;
	});
}

function sendAnswer(index) {
	fetch(`/answer/${index}`, {
		method: "POST",
	})
		.then((response) => response.json())
		.then((data) => handleAnswerFeedback(data));
}

function fillQuestionElements(data) {
	if (data.winner === true) {
		h2.textContent = "Wygrałeś/aś!!!";
		gameBoard.style.display = "none";
	} else if (data.loser === true) {
		h2.textContent = "Przegrałeś/aś :(";
		gameBoard.style.display = "none";
	} else {
		questionDiv.textContent = data.question;
		answerButtons.forEach((answer, index) => {
			answer.textContent = data.answers[index];
		});
		answerButtons.forEach((answer) => answer.classList.remove("hide"));
		tipDiv.innerHTML = "";
	}
}

function showNextQuestion() {
	fetch("/question", {
		method: "GET",
	})
		.then((response) => response.json())
		.then((data) => fillQuestionElements(data));
}

function phoneAFriend() {
	fetch("/help/friend", {
		method: "GET",
	})
		.then((response) => response.json())
		.then((data) => handleFriendsAnswer(data));
}

function fiftyFifty() {
	fetch("/help/fifty-fifty", {
		method: "GET",
	})
		.then((response) => response.json())
		.then((data) => handleFiftyFiftyFeedback(data));
}

function askTheAudience() {
	fetch("help/ask-the-audience", {
		method: "GET",
	})
		.then((response) => response.json())
		.then((data) => handleAskTheAudienceFeedback(data));
}

showNextQuestion();
