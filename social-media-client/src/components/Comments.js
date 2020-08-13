import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';


const styles = {
    visibleSeperator: {
        width: '100%',
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        marginBottom: 20
    },
    invisibleSeperator:{
        border: 'none',
        margin: 4
    },
    commentImage: {
        width: 100,
        height: 100,
        objectFit: 'cover',
        borderRadius: '50%',
        marginLeft: 40
    },
    commentData: {
        marginLeft: 20,
        marginBottom: 20
    }
}

class Comments extends Component {
    render() {
        const { comments, classes } = this.props;
        return (
            <Grid container>
                {comments.map((comment, index) => {
                    const { body, createdAt, userHandle, userImage} = comment;
                    return (
                        <Fragment key={createdAt} >
                            <Grid item sm={10}>
                                <Grid container>
                                    <Grid item sm={3}>
                                        <img 
                                            src={userImage} 
                                            className={classes.commentImage}
                                        />
                                    </Grid>
                                    <Grid item sm={7}>
                                        <div className={classes.commentData}>
                                            <Typography 
                                                variant="h5"
                                                component={Link}
                                                to={`/users/${userHandle}`}
                                                color="secondary"
                                            >
                                                {userHandle}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                            >
                                                {dayjs(createdAt).format('h:mm a, MMMM DD YYYY')}
                                            </Typography>
                                            <hr className={classes.invisibleSeperator} />
                                            <Typography variant="body1">{body}</Typography>

                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            {index !== comments.length-1 ? (
                                <hr className={classes.visibleSeperator} />
                            ): (
                                null
                            )}
                        </Fragment>
                    )
                })}

            </Grid>
        )
    }
}

export default withStyles(styles)(Comments);
