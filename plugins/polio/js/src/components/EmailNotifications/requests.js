import {
    iasoGetRequest,
    iasoPutRequest,
} from '../../../../../../hat/assets/js/apps/Iaso/utils/requests';

export const getCountryUsersGroup = async (_dispatch, url) => {
    const data = await iasoGetRequest({
        requestParams: { url },
        disableSuccessSnackBar: true,
    });
    return {
        country_users_group: data.country_users_group,
        pages: data.pages, // TODO add to API
        count: data.count, // TODO add to API
    };
};

export const getCountryConfigDetails = async id => {
    return iasoGetRequest({
        requestParams: { url: `/api/polio/countryusersgroup/${id}` },
        disableSuccessSnackBar: true,
    });
};

export const putCountryConfigDetails = async ({ id, users, language }) => {
    return iasoPutRequest({
        requestParams: {
            url: `/api/polio/countryusersgroup/${id}/`,
            body: { users, language },
        },
    });
};
