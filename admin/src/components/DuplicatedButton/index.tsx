import { Button } from '@strapi/design-system';
import { Duplicate } from '@strapi/icons';
import {
  Page,
  unstable_useContentManagerContext as useContentManagerContext,
  useNotification,
} from '@strapi/strapi/admin';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useCurrentDocument } from '../../hooks/useCurrentDocument';
import { useLocale } from '../../hooks/useLocale';
import CopyModal from '../CopyModal';
const LocaleButton = styled(Button)`
  width: 100%;
`;

const LoadingScreen = styled.div`
  position: fixed;
  z-index: 100;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
`;
const content = {
  id: 'duplicate-button.components.duplicate.button',
  defaultMessage: 'Duplicate',
};

interface Props {
  slug: string;
}
const DuplicateButton = (props: Props) => {
  const contentViewData = useContentManagerContext();
  const navigate = useNavigate();
  const { contentType, hasDraftAndPublish, collectionType, form, isSingleType, id } =
    contentViewData;
  const uid = isSingleType ? props.slug : `${props.slug}/${id}`;
  const { initialValues }: any = form;
  const { locale: currentLocale } = useParams();
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { locale, loading } = useLocale();
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [existedLocales, setExistedLocales] = useState<string[]>([]);
  const toggleModal = () => setModalOpen(!modalOpen);
  const handleButtonClick = async () => {
    setIsLoading(true);
    const response = await doc.getDocument();
    const existLocale = [(response?.data as { locale: string })?.locale];
    if (response?.meta?.availableLocales?.length) {
      for (const item of response.meta.availableLocales) {
        existLocale.push(item?.locale);
      }
    }
    setExistedLocales(existLocale);
    setIsLoading(false);
    toggleModal();
  };
  const allowedLocales = locale.filter(({ code }) => code !== currentLocale);
  const handleCancel = () => {
    if (!isLoading) toggleModal();
  };

  const handleSubmit = async (selectedLocale: string) => {
    try {
      if (!isSingleType && !id) throw new Error('ID is not exist');
      if (hasDraftAndPublish) {
        let resp = await doc.createDraftDocument({ ...initialValues, locale: selectedLocale });
        if (!resp.status) throw resp.error;
      } else {
        let resp = await doc.createPublishDocument({ ...initialValues, locale: selectedLocale });
        if (!resp.status) throw resp.error;
      }
      toggleModal();
      toggleNotification({
        type: 'success',
        message: formatMessage({
          id: 'Success',
          defaultMessage: 'Copy successfully',
        }),
      });

      navigate(`?plugins[i18n][locale]=${selectedLocale}`, {
        replace: true,
      });
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: formatMessage({
          // id: 'my.message.id',
          id: 'Error',
          defaultMessage: `Copy failed ${error}`,
        }),
      });
    }
  };
  const doc = useCurrentDocument({
    type: collectionType,
    uid,
    id,
  });

  if (isLoading) {
    return (
      <LoadingScreen>
        <Page.Loading />
      </LoadingScreen>
    );
  }
  if (!(contentType?.pluginOptions as any)?.i18n?.localized || (!isSingleType && !id)) {
    return null;
  }
  return (
    <>
      <LocaleButton icon={<Duplicate />} onClick={handleButtonClick} label={formatMessage(content)}>
        Copy with locale
      </LocaleButton>

      <CopyModal
        isOpen={modalOpen}
        onClose={handleCancel}
        onSubmit={handleSubmit}
        isLoading={loading}
        allLocales={allowedLocales}
        existingLocales={existedLocales}
      />
    </>
  );
};

export default DuplicateButton;
