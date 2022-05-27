import React from 'react';
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
		position: 'relative',
		[theme.breakpoints.down('sm')]: {
			width: 90,
			height: 90,
		},
	},
	image: {
		objectFit: 'cover',
		width: 'inherit',
		height: 'inherit',
		borderRadius: 4,
	},
	favIcon: {
		position: 'absolute',
		bottom: 0,
		[theme.breakpoints.down('sm')]: {
			zoom: 0.7,
		},
	},
	isFav: {
		border: 'red',
	},
}));
//dogCard
const Card = ({ dogData, isFav, onFavorite }) => {
	const classes = useStyles();
	return (
		<React.Fragment>
			<Paper className={classes.paper}>
				<IconButton
					className={classes.favIcon}
					style={isFav ? { color: 'red' } : { color: '#F4F4F4' }}
					onClick={() => onFavorite(dogData)}
				>
					<FavoriteIcon></FavoriteIcon>
				</IconButton>
				<img className={classes.image} src={dogData} alt=""></img>
			</Paper>
		</React.Fragment>
	);
};
export default Card;
