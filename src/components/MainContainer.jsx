import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField, Button } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import { Paper, Box } from '@material-ui/core';
import DogCard from './dogCard';

import SearchIcon from '@material-ui/icons/Search';
import FavoriteIcon from '@material-ui/icons/Favorite';

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
	input: {
		width: '90%',
		margin: 'auto',
	},
	textField: {},
}));
function MainContainer() {
	const classes = useStyles();
	const [dogsList, setDogsList] = useState(null);
	const [favDogs, setFavDogs] = useState(() => {
		const localData = localStorage.getItem('favoriteDogsArr');
		return localData ? JSON.parse(localData) : [];
	});
	const [autData, setAutData] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		getRandomBreeds();
		getAutocompleteData();
	}, []);

	const getRandomBreeds = async () => {
		try {
			const data = await axios
				.get('https://dog.ceo/api/breeds/image/random/10')
				.then((res) => setDogsList(res.data.message));
			setLoading(true);
		} catch {
			console.log('API error');
		}
	};
	const getAutocompleteData = async () => {
		let dataArr = [];
		const data = await axios
			.get('https://dog.ceo/api/breeds/list/all')
			.then((res) => {
				for (let item in res.data.message) {
					dataArr.push(item);
				}
			});
		setAutData(dataArr);
	};

	const searchBreed = async (breed) => {
		if (breed) {
			try {
				const data = await axios
					.get(`https://dog.ceo/api/breed/${breed}/images/random/10`)
					.then((res) => setDogsList(res.data.message));
				setLoading(true);
			} catch {
				console.log('breed not found');
			}
		}
	};

	const HandleAutocomplete = () => {
		return (
			<div className={classes.input}>
				<Autocomplete
					disablePortal
					id="breed-autocomplete"
					getOptionLabel={(autData) => `${autData}`}
					options={autData}
					noOptionsText={'breed not found'}
					renderInput={(params) => (
						<div>
							<TextField
								style={{
									width: '80%',
								}}
								variant="outlined"
								{...params}
								label="Buscar razas de perro"
							/>
							<Button
								style={{
									padding: 15,
									paddingLeft: 30,
									paddingRight: 30,
								}}
								variant="contained"
								onClick={() => {
									searchBreed(params.inputProps.value);
									console.log(params.inputProps.value);
								}}
							>
								<SearchIcon style={{ marginRight: 5 }} />
								Buscar
							</Button>
						</div>
					)}
				/>
			</div>
		);
	};

	const handleFavorites = (data) => {
		let parseData = localStorage.getItem('favoriteDogsArr');
		let localData = parseData ? JSON.parse(parseData) : [];
		if (localData && localData.length > 0 && localData.includes(data)) {
			//si ya se encuentra la imagen en favoritos, se borra del array del localStorage
			localData = localData.filter((element) => element !== data);
			localStorage.setItem('favoriteDogsArr', JSON.stringify(localData));
			setFavDogs(localData);
			return;
		}
		//si la imagen no estaba en favoritos, se agrega a localStorage
		localData.push(data);
		localStorage.setItem('favoriteDogsArr', JSON.stringify(localData));
		setFavDogs([...favDogs, data]);
	};

	const favState = (element) => {
		if (favDogs.includes(element)) {
			return true;
		}
		return false;
	};
	function handleDogCards(dogsList) {
		return (
			<React.Fragment>
				<Grid container justifyContent="center" spacing={2}>
					{dogsList.map((element) => (
						<Grid key={element} item>
							<DogCard
								dogData={element}
								isFav={favState(element)}
								onFavorite={handleFavorites}
							/>
						</Grid>
					))}
				</Grid>
			</React.Fragment>
		);
	}
	function handleFavsCards() {
		return (
			<React.Fragment>
				<Box
					style={{
						display: 'flex',
						paddingLeft: 10,
						borderTop: 'solid',
						borderColor: '#CACACA',
						marginTop: 20,
					}}
				>
					<FavoriteIcon
						style={{ marginTop: 28, marginRight: 10, color: 'red' }}
					/>
					<h1>Favoritos</h1>
				</Box>

				<Grid container justifyContent="center" spacing={2}>
					{favDogs.map((element) => (
						<Grid key={element} item>
							<DogCard
								dogData={element}
								isFav={favState(element)}
								onFavorite={handleFavorites}
							/>
						</Grid>
					))}
				</Grid>
			</React.Fragment>
		);
	}
	return (
		<Box className="App">
			<Paper className={classes.paper}>
				<Box className={classes.appTitle}>
					<h2>Razas de Perro</h2>
				</Box>
				<HandleAutocomplete />
				<Box>
					{loading ? handleDogCards(dogsList) : <CircularProgress />}
				</Box>
				<Box>{loading ? handleFavsCards() : <CircularProgress />}</Box>
			</Paper>
		</Box>
	);
}

export default MainContainer;
