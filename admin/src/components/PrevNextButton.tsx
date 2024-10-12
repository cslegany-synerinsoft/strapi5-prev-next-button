import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom"; //In react-router-dom v6 useHistory() is replaced by useNavigate().
import { unstable_useContentManagerContext as useContentManagerContext } from '@strapi/strapi/admin';
import {
    IconButton,
    Flex,
    Typography,
    Box,
} from '@strapi/design-system';
import { ArrowLeft, ArrowRight } from "@strapi/icons";
import { useIntl } from "react-intl";
import { getTranslation as getTrad } from '../utils/getTranslation';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { PLUGIN_ID } from "../pluginId";

type PrevNext = {
    prev: {
        id: number;
        documentId: string;
        label: string;
    } | null;
    next: {
        id: number;
        documentId: string;
        label: string;
    } | null;
};

const PrevNextButton = () => {
    const { formatMessage } = useIntl();
    const { isSingleType, isCreatingEntry, contentType } = useContentManagerContext();
    const uid = contentType?.uid ?? "";

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const [prevNext, setPrevNext] = React.useState<PrevNext | null>(null);

    const { get } = useFetchClient();

    if (isSingleType || isCreatingEntry || pathname.toLowerCase().endsWith("/create")) //isCreatingEntry can be false even though we're creating an entry
        return null;

    React.useEffect(() => {
        const fetchNextItemId = async () => {
            try {
                if (id) {
                    const endpoint = `/${PLUGIN_ID}/prev-next/${uid}/${id}`;
                    const { data } = await get(endpoint);
                    setPrevNext(data);
                }
            } catch (error) {
                console.error("Error fetching item ID:", error);
            }
        };

        fetchNextItemId();
    }, [id, uid, isSingleType]);

    const onPrev = () => {
        const prevItemPath = `${uid}/${prevNext?.prev?.documentId}`;
        const prevPathname = pathname.replace(`${uid}/${id}`, prevItemPath)
        navigate(prevPathname, {
            state: { from: pathname },
        });
    }

    const onNext = () => {
        const nextItemPath = `${uid}/${prevNext?.next?.documentId}`;
        const nextPathname = pathname.replace(`${uid}/${id}`, nextItemPath);
        navigate(nextPathname, {
            state: { from: pathname },
        });
    }

    if (!prevNext)
        return null;

    return (
        <Box paddingBottom={2} paddingTop={2} width={'100%'}>
            <Flex background="neutral100" justifyContent="space-between">
                <IconButton
                    withTooltip={false} variant="secondary"
                    disabled={!prevNext.prev}
                    onClick={onPrev}
                    label={prevNext.prev?.label}>
                    <ArrowLeft />
                </IconButton>
                <Typography>{formatMessage({ id: getTrad("plugin.prev-next-label") })}</Typography>
                <IconButton
                    withTooltip={false} variant="secondary"
                    disabled={!prevNext.next}
                    onClick={onNext}
                    label={prevNext.next?.label}>
                    <ArrowRight />
                </IconButton>
            </Flex>
        </Box>
    );
};

export default PrevNextButton;