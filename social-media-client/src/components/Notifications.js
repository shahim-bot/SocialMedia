import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Typography from '@material-ui/core/Typography';
import NotificationsIcon from '@material-ui/icons/Notifications';
import ChatIcon from '@material-ui/icons/Chat';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { markNotificationsRead } from '../redux/actions/userActions';

class Notifications extends Component {

    constructor(){
        super();
        this.state = {
            anchorElement: null
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen = (event) => {
        this.setState({
            anchorElement: event.target
        });
    }

    onMenuOpen = () => {
        let unReadNotificationsIds = this.props.notifications
                                    .filter(notif => !notif.read)
                                    .map(notif => notif.notificationId);

        this.props.markNotificationsRead(unReadNotificationsIds);
    }

    handleClose = () => {
        this.setState({
            anchorElement: null
        });
    }

    render() {
        const notifications = this.props.notifications;
        const anchorElement = this.state.anchorElement;

        let notificationIcon;
        if(notifications && notifications.length > 0){
            notifications.filter(notif => notif.read === false).length > 0 ? (
                notificationIcon = (
                    <Badge
                        badgeContent={notifications.filter(notif => notif.read === false).length}
                        color="secondary"
                    >
                        <NotificationsIcon />
                    </Badge>
                )
            ) : (
                notificationIcon = <NotificationsIcon />
            );
        }
        else{
            notificationIcon = <NotificationsIcon />
        }

        dayjs.extend(relativeTime);

        let notificationsMarkup = 
            (notifications && notifications.length > 0) ? (
                notifications.map(notif => {
                    const type = notif.type === 'like' ? 'liked' : 'commented on';
                    const time = dayjs(notif.createdAt).fromNow();
                    const iconColor = notif.read ? 'primary' : 'secondary';
                    const icon = notif.type === 'like' ? (
                        <FavoriteIcon color={iconColor} style={{marginRight: 10}} />
                    ) : (
                        <ChatIcon color={iconColor} style={{marginRight: 10}} />
                    );
                    return (
                        <MenuItem 
                            onClick={this.handleClose}
                            key={notif.createdAt}
                        >
                           {icon}
                            <Typography
                                component={Link}
                                color="inherit"
                                variant="body1"
                                to={`/users/${notif.recipient}/post/${notif.postId}`}
                            >
                                {notif.sender} {type} your post {time}
                            </Typography>
                        </MenuItem>
                    );
                })

            ) : (
                    <MenuItem onClick={this.handleClose}>
                        You have no Notifications yet.
                    </MenuItem>
            )

        return (
            <Fragment>
                <Tooltip
                    placement="top"
                    title="Notifications"
                >
                    <IconButton
                        aria-owns={anchorElement ? 'simple-menu' : undefined}
                        aria-haspopup="true"
                        onClick={this.handleOpen}
                    >
                        {notificationIcon}
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorElement}
                    open={Boolean(anchorElement)}
                    onEntered={this.onMenuOpen}
                    onClose={this.handleClose}
                >
                    {notificationsMarkup}
                </Menu>
            </Fragment>
        )
    }
}

const mapStateToProps = (state) =>({
    notifications: state.user.notifications
});

const mapActionsToProps = {
    markNotificationsRead
};

export default connect(mapStateToProps, mapActionsToProps)(Notifications);
