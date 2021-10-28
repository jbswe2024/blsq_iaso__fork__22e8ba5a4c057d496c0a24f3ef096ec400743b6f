import React from 'react';
import { Redirect, Route } from 'react-router';
import { baseUrls } from '../constants/urls';
import { getChipColors } from '../constants/chipColors';

import { getMetasColumns } from '../domains/instances/utils';

import { locationLimitMax } from '../domains/orgUnits/constants/orgUnitConstants';
import Page404 from '../components/errors/Page404';

const addRoutes = baseRoutes =>
    baseRoutes.concat([
        <Redirect path="/" to={baseUrls.forms} />,
        <Redirect
            path={baseUrls.orgUnits}
            to={`${
                baseUrls.orgUnits
            }/locationLimit/${locationLimitMax}/order/id/pageSize/50/page/1/searchTabIndex/0/searches/[{"validation_status":"all", "color":"${getChipColors(
                0,
            ).replace('#', '')}"}]`}
        />,
        <Redirect
            path={baseUrls.instances}
            to={`${baseUrls.instances}/columns/${getMetasColumns().join(',')}`}
        />,
        <Redirect
            path={baseUrls.mappings}
            to={`${baseUrls.mappings}/order/form_version__form__name,form_version__version_id,mapping__mapping_type/pageSize/20/page/1`}
        />,
        <Redirect
            path={baseUrls.users}
            to={`${baseUrls.users}/order/user__username/pageSize/20/page/1`}
        />,
        <Redirect
            path={baseUrls.groups}
            to={`${baseUrls.groups}/order/name/pageSize/20/page/1`}
        />,
        <Redirect
            path={baseUrls.orgUnitTypes}
            to={`${baseUrls.orgUnitTypes}/order/name/pageSize/20/page/1`}
        />,
        // Catch all route, need to be at the end
        <Route
            path="/*"
            component={({ location }) => <Page404 location={location} />}
        />,
    ]);

export { addRoutes };
