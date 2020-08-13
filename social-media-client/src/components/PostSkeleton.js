import React, { Fragment } from 'react';
import noImg from '../images/no-img.png';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';

import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
    card:{
        display: 'flex',
        marginBottom: 20
    },
    cardMedia:{
        minWidth: 200,
        objectFit: 'cover'
    },
    cardContent:{
        width: '100%',
        flexDirection: 'column',
        padding: 25
    },
    handle:{
        width: 60,
        height: 20,
        backgroundColor: '#df6843',
        marginBottom: 7
    },
    date:{
        width: 100,
        height: 14,
        backgroundColor: 'rgba(0,0,0,0.3)',
        marginBottom: 10
    },
    fullLine:{
        height: 15,
        width: '200%',
        marginBottom: 10,
        backgroundColor: 'rgba(0,0,0,0.6)'
    },
    halfLine:{
        height: 15,
        width: '100%',
        marginBottom: 10,
        backgroundColor: 'rgba(0,0,0,0.6)'
    }
};

const PostSkeleton = (props) => {

    const { classes } = props;

    const content = Array.from({ length: 5 }).map((item, index) => (
        <Card className={classes.card} key={index}>
            <CardMedia className={classes.cardMedia} image={noImg} />
            <CardContent className={classes.CardContent}>
                <div className={classes.handle} />
                <div className={classes.date} />
                <div className={classes.fullLine} />
                <div className={classes.fullLine} />
                <div className={classes.halfLine} />
            </CardContent>
        </Card>
    ))

    return <Fragment>{content}</Fragment>
}

export default withStyles(styles)(PostSkeleton);