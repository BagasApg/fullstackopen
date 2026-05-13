import { useState } from "react";

const Button = (props) => {
	return <button onClick={props.onClick}>{props.text}</button>;
};

const StatisticLine = (props) => {
	return (
		<tr>
			<td>{props.text}</td>
			<td>{props.value}</td>
		</tr>
	);
};

const Statistics = (props) => {
	const all =
		0 + props.ratings.good + props.ratings.neutral + props.ratings.bad;
	const average =
		(props.ratings.good * 1 +
			props.ratings.neutral * 0 +
			props.ratings.bad * -1) /
		all;
	const positive_perc = (props.ratings.good / all) * 100;
	if (props.act) {
		return (
			<div>
				<table>
					<tbody>
						<StatisticLine value={props.ratings.good} text="good" />
						<StatisticLine value={props.ratings.neutral} text="neutral" />
						<StatisticLine value={props.ratings.bad} text="bad" />
						<StatisticLine value={average} text="average" />
						<StatisticLine value={positive_perc + "%"} text="positive" />
					</tbody>
				</table>
			</div>
		);
	}
	return <div>No feedback given</div>;
};

const App = () => {
	const [ratings, setRatings] = useState({
		good: 0,
		neutral: 0,
		bad: 0,
	});

	const [act, setAct] = useState(0);

	const handleRatings = (rating) => () => {
		let good = ratings.good,
			neutral = ratings.neutral,
			bad = ratings.bad;
		if (rating == "good") {
			good = good + 1;
		} else if (rating == "neutral") {
			neutral = neutral + 1;
		} else {
			bad = bad + 1;
		}

		const newRatings = {
			good: good,
			neutral: neutral,
			bad: bad,
		};

		setRatings(newRatings);
		setAct(1);
	};

	return (
		<div>
			<h1>give feedback</h1>
			<Button onClick={handleRatings("good")} text="good" />
			<Button onClick={handleRatings("neutral")} text="neutral" />
			<Button onClick={handleRatings("bad")} text="bad" />
			<h1>statistics</h1>
			<Statistics ratings={ratings} act={act} />
		</div>
	);
};

export default App;
