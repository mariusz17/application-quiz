function gameRoutes(app) {
	let goodAnswers = 0;
	let isGameOver = false;
	let callToAFriendUsed = false;
	let fiftyFiftyUsed = false;
	let askTheAudienceUsed = false;
	let fiftyFiftyQuestion;
	const discardedAnswers = [];

	const questions = [
		{
			question:
				"Jaki jest najlepszy język programowania na świecie według mnie?",
			answers: ["C++", "Fortran", "JavaScript", "Java"],
			correctAnswer: 2,
		},
		{
			question: "Czy ten kurs jest fajny?",
			answers: [
				"Nie wiem",
				"Oczywiście, że tak",
				"Oczywiście, że nie",
				"Jest najlepszy",
			],
			correctAnswer: 3,
		},
		{
			question: "Czy chcesz zjeść pizzę?",
			answers: [
				"Nawet dwie!",
				"Jestem na diecie",
				"Nie, dziękuję",
				"Wolę brokuły",
			],
			correctAnswer: 0,
		},
	];

	app.get("/question", (req, res) => {
		if (goodAnswers === questions.length) {
			res.json({
				winner: true,
			});
		} else if (isGameOver) {
			res.json({
				loser: true,
			});
		} else {
			const nextQuestion = questions[goodAnswers];
			const { question, answers } = nextQuestion;
			res.json({ question, answers });
		}
	});

	app.post("/answer/:index", (req, res) => {
		if (isGameOver) res.json({ loser: true });

		const { index } = req.params;
		const question = questions[goodAnswers];
		const isCorrectAnswer = Number(index) === question.correctAnswer;
		if (isCorrectAnswer) {
			goodAnswers++;
		} else {
			isGameOver = true;
		}
		res.json({ correct: isCorrectAnswer, goodAnswers });
	});

	app.get("/help/friend", (req, res) => {
		if (callToAFriendUsed)
			return res.json({
				text: "To koło ratunkowe było już wykorzystane.",
			});
		callToAFriendUsed = true;

		const doesFriendKnow = Math.random() < 0.5;
		const question = questions[goodAnswers];
		res.json({
			text: doesFriendKnow
				? `Hmm wydaje mi się, że poprawna odpowiedź to ${
						question.answers[question.correctAnswer]
				  }`
				: "Oj nie wiem jaka jest poprawna odpowiedź",
		});
	});

	app.get("/help/fifty-fifty", (req, res) => {
		if (fiftyFiftyUsed)
			return res.json({
				text: "To koło ratunkowe było już wykorzystane.",
			});
		fiftyFiftyUsed = true;

		fiftyFiftyQuestion = goodAnswers;
		const question = questions[goodAnswers];
		let i = 0;
		let answersToBeSorted = question.answers.map(() => i++);
		answersToBeSorted = answersToBeSorted.filter(
			(item) => item !== question.correctAnswer
		); //wyrzucenie poprawnej odpowiedzi z tablicy,
		//z której będziemy losować dwa elementy, które ma skrypt odrzucić

		//sortowanie odpowiedzi po nadanych im tymczasowo losowych liczbach
		let answersSorted = answersToBeSorted
			.map((item) => ({ item, x: Math.random() })) // dodanie losowej liczby do każdego elementu tablicy
			.sort((a, b) => a.x - b.x) // sortowanie od największych do najmniejszych
			.map(({ item }) => item); // "odmapowanie" tablicy obiektów do tablicy elementów (odłączenie tymczasowej losowej liczby)
		// console.log(answersSorted);

		discardedAnswers.push(answersSorted[0]);
		discardedAnswers.push(answersSorted[1]);
		res.json({
			hideAnswerIndex1: answersSorted[0],
			hideAnswerIndex2: answersSorted[1],
		});
	});

	app.get("/help/ask-the-audience", (req, res) => {
		if (askTheAudienceUsed)
			return res.json({
				text: "To koło ratunkowe było już wykorzystane.",
			});
		askTheAudienceUsed = true;

		const question = questions[goodAnswers];
		const answersVoted = [];
		let voteLeft = 100;
		const currentAnswersNumber = goodAnswers === fiftyFiftyQuestion ? 2 : 4;
		question.answers.forEach((answer, index) => {
			if (
				goodAnswers === fiftyFiftyQuestion &&
				discardedAnswers.includes(index)
			)
				return;
			let vote = 0;
			if (answersVoted.length === currentAnswersNumber - 1) {
				vote = voteLeft;
			} else {
				if (index === question.correctAnswer) {
					vote = Math.floor(Math.random() * 70 + 25);
					vote = vote > voteLeft ? voteLeft : vote;
				} else {
					vote = Math.floor(Math.random() * 25);
					vote = vote > voteLeft ? voteLeft : vote;
				}
				voteLeft -= vote;
			}
			answersVoted.push({
				answer,
				vote,
			});
		});
		res.json(JSON.stringify(answersVoted));
	});
}

export default gameRoutes;
