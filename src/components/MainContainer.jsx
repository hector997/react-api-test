import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { TextField, Button } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';

import { Paper, Box } from '@material-ui/core';

import DogCard from './dogCard';

const useStyles = makeStyles((theme) => ({
	paper: {
		maxWidth: '80%',
		margin: 'auto',
		marginTop: 10,
		padding: 20,
		background: '#FAFAFA',
	},
	appTitle: {
		textAlign: 'left',
	},
	searchBar: {
		width: '100%',
	},
}));
function MainContainer() {
	const classes = useStyles();
	const [dogsList, setDogsList] = useState(null);
	const [favDogs, setFavDogs] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getRandomBreeds();
	}, []);

	const getRandomBreeds = async () => {
		try {
			const data = await axios
				.get('https://dog.ceo/api/breeds/image/random/10')
				.then((res) => setDogsList(res.data.message));
			setLoading(true);
		} catch {
			console.log('lapeor');
		}
	};

	const searchBreed = async (breed) => {
		if (breed) {
			try {
				const data = await axios
					.get(`https://dog.ceo/api/breed/${breed}/images`)
					.then((res) => setDogsList(res.data.message));
				setLoading(true);
			} catch {
				console.log('lapeor');
			}
		}
	};

	const addToFavorites = (data) => {
		console.log('afa', data);
		if (localStorage.getItem(data, data)) {
			console.log(data, 'is in favs');
			localStorage.removeItem(data);
			return;
		}
		localStorage.setItem(data, JSON.stringify([data]));
		const favouriteDogs = localStorage.getItem(data);
		setFavDogs([...favDogs, favouriteDogs]);
		console.log(favDogs);
	};

	function handleDogCards(dogsList) {
		console.log('doglist', dogsList);
		return (
			<React.Fragment>
				<Grid container justifyContent="center" spacing={2}>
					{dogsList.map((element) => (
						<Grid key={element} item>
							<DogCard
								dogData={element}
								onFavorite={addToFavorites}
							/>
						</Grid>
					))}
				</Grid>
			</React.Fragment>
		);
	}
	function handleFavsCards() {
		const getFavorites = () => {};
		return (
			<React.Fragment>
				<p>favoritos</p>
				{/* <Grid container justifyContent="center" spacing={2}>
					{favDogs.map((element) => (
						<Grid key={element} item>
							<DogCard
								dogData={element}
								onFavorite={addToFavorites}
							/>
						</Grid>
					))}
				</Grid> */}
			</React.Fragment>
		);
	}

	return (
		<div className="App">
			<Paper className={classes.paper}>
				<Box className={classes.appTitle}>
					<h2>Razas de Perro</h2>
				</Box>
				<div>
					<form className={classes.searchBar}>
						<TextField
							id="search-bar"
							className="text"
							label="buscar razas"
							onInput={(e) => {
								searchBreed(e.target.value);
							}}
							variant="outlined"
							placeholder="Search..."
							size="small"
						/>
						<Button type="submit" aria-label="search">
							buscar
						</Button>
					</form>
				</div>
				<div>
					{loading ? handleDogCards(dogsList) : <CircularProgress />}
				</div>
				<div>{loading ? handleFavsCards() : <CircularProgress />}</div>
			</Paper>
		</div>
	);
}

export default MainContainer;
