import React, { useEffect, useState } from 'react';
import { Paper, IconButton } from '@material-ui/core';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
	paper: {
		width: 260,
		height: 260,
		borderRadius: 4,
		margin: 'auto',
		marginTop: 10,
		background: '#FAFAFA',
	},
	image: {
		objectFit: 'cover',
		width: 260,
		height: 260,
		borderRadius: 4,
	},
	favIcon: {
		position: 'absolute',
	},
	isFav: {
		border: 'red',
	},
}));
// () => {
//     const localData = localStorage.getItem('fav');
//     return localData ? localData : [];
// }

const Card = ({ dogData, onFavorite }) => {
	const classes = useStyles();
	const [isFavorite, setIsFavorite] = useState(false);

	const setFavorite = (e) => {
		onFavorite(e);
		setIsFavorite(!isFavorite);
		console.log('favState', isFavorite);
	};

	return (
		<React.Fragment>
			<Paper className={classes.paper}>
				<IconButton
					className={classes.favIcon}
					style={isFavorite ? { color: 'red' } : { color: '#F4F4F4' }}
					onClick={() => setFavorite(dogData)}
				>
					<FavoriteIcon></FavoriteIcon>
				</IconButton>
				<img
					className={classes.image}
					src={dogData}
					alt="error al cargar"
				></img>
			</Paper>
		</React.Fragment>
	);
};
export default Card;
