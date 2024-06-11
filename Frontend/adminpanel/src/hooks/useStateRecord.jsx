import { useState } from 'react';

export const useStateRecords = (record, currentTable) => {
    debugger
    const [about, setAbout] = useState({});
    const [accessLevels, setAccessLevels] = useState({});
    const [contacts, setContacts] = useState({});
    const [languages, setLanguages] = useState({ Id: 0, FullName: "", Abbreviation: "", Description: "", DateFormat: "", TimeFormat: "" });
    const [posts, setPosts] = useState({});
    const [postsTranstations, setPostsTranstations] = useState({});
    const [users, setUsers] = useState({});
    const [userProfile, setUserProfile] = useState({});
    const [userRoles, setUserRoles] = useState({});

    switch (currentTable) {
        case 'About':
            setAbout(record);
            return [about, setAbout];
        case 'AccessLevels':
            setAccessLevels(record);
            return [accessLevels, setAccessLevels];
        case 'Contacts':
            setContacts(record);
            return [contacts, setContacts];
        case 'Languages':
            setLanguages(record);
            return [languages, setLanguages];
        case 'Posts':
            setPosts(record);
            return [posts, setPosts];
        case 'PostsTranstations':
            setPostsTranstations(record);
            return [postsTranstations, setPostsTranstations];
        case 'Users':
            setUsers(record);
            return [users, setUsers];
        case 'UserProfile':
            setUserProfile(record);
            return [userProfile, setUserProfile];
        case 'UserRoles':
            setUserRoles(record);
            return [userRoles, setUserRoles];
        default:
            break;
    };
};