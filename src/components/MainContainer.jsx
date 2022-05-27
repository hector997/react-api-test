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
import SentimentVeryDissatisfiedIcon from '@material-ui/icons/SentimentVeryDissatisfied';

const useStyles = makeStyles((theme) => ({
	paper: {
		maxWidth: '80%',
		margin: 'auto',
		marginTop: 10,
		padding: 50,
		background: '#FAFAFA',
	},
	container: {
		width: '87%', //con este width quedan alineadas las cards con el resto de los componentes
		margin: 'auto',
	},
	appTitle: {
		textAlign: 'left',
	},
	input: {
		margin: 'auto',
	},
	textField: {},
}));
function MainContainer() {
	const classes = useStyles();
	const [dogsList, setDogsList] = useState(null);
	const [favDogs, setFavDogs] = useState(() => {
		const localData = localStorage.getItem('favoriteDogsArr');
		return localData ? JSON.parse(localData) : []; // si hay algo en el localStorage (lo que estaba antes de recargar la pagina), se le asigna como valor por defecto a favDogs
	});
	const [autData, setAutData] = useState([]);
	const [loading, setLoading] = useState(false);
	const [currentBreed, setCurrentBreed] = useState('');

	useEffect(() => {
		getRandomBreeds();
		getAutocompleteData();
	}, []);

	const getRandomBreeds = async () => {
		//devuelve un array de perros random para mostrar cuando no se ha hecho ninguna busqueda
		setCurrentBreed('');
		try {
			const response = await axios.get(
				'https://dog.ceo/api/breeds/image/random/12'
			);
			setDogsList(response.data.message);
			setLoading(true);
		} catch {
			console.log('API error');
			setDogsList('apiError');
		}
	};
	const getAutocompleteData = async () => {
		// esta funcion obtiene la lista de razas para mostrar en el autocomplete
		let dataArr = [];
		const response = await axios.get('https://dog.ceo/api/breeds/list/all');
		for (let item in response.data.message) {
			if (response.data.message[item].length !== 0) {
				for (let subBreed of response.data.message[item]) {
					dataArr.push({
						breed: item,
						subreed: subBreed,
					});
				}
			} else {
				dataArr.push({
					breed: item,
				});
			}
		}
		setAutData(dataArr);
	};
	const searchBreeds = async (breed) => {
		//realiza el llamado a la api con la informacion del input
		setCurrentBreed(breed);
		try {
			if (breed.includes(' ')) {
				//si el input tiene una subreed, tiene que tener un espacio. Entonces se chequea si tiene espacios y
				//se arma el nuevo llamado a la api teniendo en cuenta la breed y la subreed
				const inputArr = breed.split(' ');
				const mainBreed = inputArr[0];
				const subreed = inputArr[1];
				const response = await axios.get(
					`https://dog.ceo/api/breed/${mainBreed}/${subreed}/images/random/10`
				);
				setDogsList(response.data.message);
				setLoading(true);
			} else {
				const response = await axios.get(
					`https://dog.ceo/api/breed/${breed}/images/random/10`
				);
				setDogsList(response.data.message);
				setLoading(true);
			}
		} catch {
			console.log('breed not found');
			setDogsList('notFound');
		}
	};
	const clearFavorites = () => {
		localStorage.clear();
		setFavDogs([]);
	};
	const handleFavorites = (data) => {
		let parseData = localStorage.getItem('favoriteDogsArr');
		let localData = parseData ? JSON.parse(parseData) : [];
		if (localData && localData.length > 0 && localData.includes(data)) {
			//si ya se encuentra la imagen en favoritos, se borra del array y del localStorage
			localData = localData.filter((element) => element !== data);
			localStorage.setItem('favoriteDogsArr', JSON.stringify(localData));
			setFavDogs(localData);
			return;
		}
		//si la imagen no estaba en favoritos, se agrega a localStorage y al array que se utiliza para renderizar la seccion de favoritos
		localData.push(data);
		localStorage.setItem('favoriteDogsArr', JSON.stringify(localData));
		setFavDogs([...favDogs, data]);
	};

	const favState = (element) => {
		// esto se fija si la imagen esta en favoritos y devuelve un boolean que se utiliza para pintar de rojo el icono de favoritos
		if (favDogs.includes(element)) {
			return true;
		}
		return false;
	};
	function mainDogsDisplay(dogsList) {
		// esta funcion renderiza la lista de imagenes principal, ya sea de perros random o de los perros buscados
		if (dogsList === 'notFound') {
			return (
				<React.Fragment>
					<p>No se encotraron razas que coincidan con la busqueda.</p>
				</React.Fragment>
			);
		} else if (dogsList === 'apiError') {
			return (
				<React.Fragment>
					<p>
						Hubo un error con la base de datos, intentalo de nuevo
						mas tarde
					</p>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<h4
						style={{
							textAlign: 'left',
							textTransform: 'capitalize',
							paddingLeft: 10,
						}}
					>
						{currentBreed}
					</h4>
					<Grid container justifyContent="center" spacing={5}>
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
	}
	function FavoriteDogsDisplay() {
		// esta funcion renderiza la seccion de favoritos
		if (favDogs.length !== 0) {
			return (
				<React.Fragment>
					<Grid container justifyContent="center" spacing={5}>
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
		} else {
			return (
				<React.Fragment>
					<SentimentVeryDissatisfiedIcon style={{ color: 'grey' }} />
					<h4 style={{ color: 'grey' }}>
						Aún no tenes perros favoritos
					</h4>
				</React.Fragment>
			);
		}
	}
	const SearchBar = () => {
		//
		return (
			<div className={classes.input}>
				<Autocomplete
					disablePortal
					id="breed-autocomplete"
					getOptionLabel={(autData) => {
						if (autData.subreed) {
							return `${autData.breed} ${autData.subreed}`;
						} else {
							return `${autData.breed}`;
						}
					}}
					options={autData}
					noOptionsText={
						'no se encontraron razas que coincidan con la busqueda'
					}
					renderInput={(params) => (
						<div style={{ display: 'flex' }}>
							<TextField
								size="fullWidth"
								variant="outlined"
								{...params}
								label="Buscar razas de perro"
								placeholder="ingresar raza/ sub raza. ej: 'terrier border'"
							/>
							<Button
								style={{
									padding: 15,
									paddingLeft: 30,
									paddingRight: 30,
									marginLeft: 5,
									background: '#0794E3',
									color: '#FAFAFA',
									boxShadow: 'none',
								}}
								variant="contained"
								onClick={() => {
									searchBreeds(params.inputProps.value);
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
	return (
		<Box className="App">
			<Paper className={classes.paper}>
				<Box className={classes.container}>
					<Box className={classes.appTitle}>
						<h2>Razas de Perro</h2>
					</Box>
					<SearchBar />
					<Box style={{ marginTop: 30 }}>
						{loading ? (
							mainDogsDisplay(dogsList)
						) : (
							<CircularProgress style={{ marginTop: 40 }} />
						)}
					</Box>
					<Box>
						<Box
							style={{
								display: 'flex',
								paddingLeft: 10,
								borderTop: 'solid',
								borderColor: '#CACACA',
								marginTop: 30,
								paddingTop: 30,
								marginBottom: 30,
								justifyContent: 'space-between',
							}}
						>
							<Box
								style={{
									display: 'flex',
								}}
							>
								<FavoriteIcon
									style={{
										marginTop: 28,
										marginRight: 10,
										color: 'red',
									}}
								/>
								<h1>Favoritos</h1>
							</Box>
							<Button
								size="small"
								onClick={() => clearFavorites()}
							>
								clear
							</Button>
						</Box>

						<FavoriteDogsDisplay />
					</Box>
				</Box>
			</Paper>
		</Box>
	);
}

export default MainContainer;
