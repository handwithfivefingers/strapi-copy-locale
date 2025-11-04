import {
  Box,
  Button,
  SingleSelect,
  SingleSelectOption,
  Status,
  Typography,
} from '@strapi/design-system';
import { Cross } from '@strapi/icons';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import type { LocaleItem } from '../../hooks/useLocale';
import { getTranslation } from '../../utils/getTranslation';

interface ICopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (locale: string) => void;
  isLoading: boolean;
  allLocales?: Partial<LocaleItem>[];
  existingLocales?: string[];
}

const Modal = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 5;
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  .content {
    padding: 1rem;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 400px;
    background: #fff;
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.5rem;
  h3 {
    font-size: 1.875rem;
    line-height: 1.2;
    font-weight: bold;
    text-transform: capitalize;
  }
`;
const ModalContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
`;

const SelectBox = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 0.5rem 1rem;
`;
const StatusBox = styled(Status)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const CopyModal = (props: ICopyModalProps) => {
  const { formatMessage } = useIntl();
  const [selected, setSelected] = useState<string | null>(null);
  const availableLocales = props?.allLocales?.filter(
    (locale: Partial<LocaleItem>) => !props?.existingLocales?.includes?.(locale?.code as any)
  );
  return (
    <Modal isOpen={props.isOpen}>
      <div className="content">
        <ModalHeader>
          <h3>Copy with locale</h3>
          <div onClick={props.onClose} style={{ cursor: 'pointer' }} aria-hidden>
            <Cross />
          </div>
        </ModalHeader>
        <ModalContent>
          {(!availableLocales?.length && (
            <StatusBox size="S">
              <Typography fontWeight="bold">Locale are not available</Typography>
            </StatusBox>
          )) || (
            <>
              <SelectBox>
                <Typography id="confirm-description">
                  {formatMessage({
                    id: getTranslation('modal.body'),
                    defaultMessage: 'Select languague to copy?',
                  })}
                </Typography>

                <SingleSelect
                  onClear={() => setSelected(null)}
                  value={selected}
                  onChange={(v: string) => setSelected(v)}
                >
                  {availableLocales?.map((locale: any) => {
                    if (!locale) return;
                    return (
                      <SingleSelectOption key={locale?.code} value={locale?.code}>
                        {locale.name}
                      </SingleSelectOption>
                    );
                  })}
                </SingleSelect>
              </SelectBox>
              <Box>
                <Button onClick={() => props?.onSubmit(selected as string)} disabled={!selected}>
                  Process
                </Button>
              </Box>
            </>
          )}
        </ModalContent>
      </div>
    </Modal>
  );
};
export default CopyModal;
