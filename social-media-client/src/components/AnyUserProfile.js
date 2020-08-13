import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import MuiLink from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';

const styles = {
    paper: {
        padding: 20
      },
      profile: {
        '& .image-wrapper': {
          textAlign: 'center',
          position: 'relative',
        },
        '& .profile-image': {
          width: 200,
          height: 200,
          objectFit: 'cover',
          maxWidth: '100%',
          borderRadius: '50%'
        },
        '& .profile-details': {
          textAlign: 'center',
          '& span, svg': {
            verticalAlign: 'middle'
          },
          '& a': {
            color: '#00bcd4'
          }
        },
        '& hr': {
          border: 'none',
          margin: '0 0 10px 0'
        }
      }
};


class AnyUserProfile extends Component {

    render() {    
        const { 
            classes, 
            profile:{
                handle,
                imageUrl,
                createdAt,
                bio,
                website,
                location
            }
        } = this.props;
        return (
            <Paper className={classes.paper}>
                        <div className={classes.profile}>
                            <div className="image-wrapper">
                                <img src={imageUrl} alt="profile" className="profile-image"/>
                            </div>
                            <hr />
                            <div className="profile-details">
                                <MuiLink 
                                    component={Link}
                                    to={`/users/${handle}`}
                                    variant="h5"
                                    color="primary"
                                >
                                    @{handle}
                                </MuiLink>
                                <hr />
                                {bio && <Typography variant="body2">{bio}</Typography>}
                                <hr />
                                {location && (
                                    <Fragment>
                                        <LocationOn color="primary" /><span>{location}</span>
                                        <hr />
                                    </Fragment>
                                )}
                                {website && (
                                    <Fragment>
                                        <LinkIcon color="primary" />
                                            <a 
                                                href={website} 
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {' '}{website}
                                            </a>
                                            <hr />
                                    </Fragment>
                                )}
                                <CalendarTodayIcon color="primary" />{' '}
                                <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                            </div>
                        </div>
                    </Paper>
        )
    }
}

export default withStyles(styles)(AnyUserProfile);
