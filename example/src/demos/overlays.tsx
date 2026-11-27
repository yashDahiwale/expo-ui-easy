import { useRef, useState } from 'react';
import type { ModalBottomSheetRef, SnackbarHostRef, TooltipBoxRef } from '@expo/ui/jetpack-compose';
import {
  AlertDialog, BasicAlertDialog, Button, Column, Host, Icon, IconButton, ModalBottomSheet, Row, Snackbar, SnackbarHost,
  Text, TooltipBox, paddingAll,
} from 'expo-ui-easy';
import { ICONS } from '../icons';
import { ActionButton, PreviewSection, StateRow } from '../ui';

export function AlertDialogDemo() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState('-');
  return (
    <PreviewSection
      title="Title, text and actions"
      description="Slots: Icon, Title, Text, ConfirmButton, DismissButton. onDismissRequest fires on an outside tap or back."
      code={`{open ? (\n  <AlertDialog onDismissRequest={close}>\n    <AlertDialog.Title><Text>Discard draft?</Text></AlertDialog.Title>\n    <AlertDialog.ConfirmButton>\n      <Button variant="text" onPress={confirm}>Discard</Button>\n    </AlertDialog.ConfirmButton>\n  </AlertDialog>\n) : null}`}>
      <Button onPress={() => setOpen(true)}>Open AlertDialog</Button>
      {open ? (
        <AlertDialog onDismissRequest={() => { setOpen(false); setResult('dismissed'); }}>
          <AlertDialog.Icon><Icon source={ICONS.star} size={24} /></AlertDialog.Icon>
          <AlertDialog.Title><Text>Discard draft?</Text></AlertDialog.Title>
          <AlertDialog.Text><Text>This cannot be undone.</Text></AlertDialog.Text>
          <AlertDialog.ConfirmButton>
            <Button variant="text" onPress={() => { setOpen(false); setResult('confirmed'); }}>Discard</Button>
          </AlertDialog.ConfirmButton>
          <AlertDialog.DismissButton>
            <Button variant="text" onPress={() => { setOpen(false); setResult('cancelled'); }}>Cancel</Button>
          </AlertDialog.DismissButton>
        </AlertDialog>
      ) : null}
      <StateRow text={`result=${result}`} />
    </PreviewSection>
  );
}

export function BasicAlertDialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <PreviewSection title="Custom content" description="Any Compose content goes inside.">
      <Button variant="tonal" onPress={() => setOpen(true)}>Open BasicAlertDialog</Button>
      {open ? (
        <BasicAlertDialog onDismissRequest={() => setOpen(false)}>
          <Column modifiers={[paddingAll(24)]} verticalArrangement={{ spacedBy: 12 }}>
            <Text variant="titleLarge">Custom dialog</Text>
            <Text>Any Compose content goes here.</Text>
            <Button variant="text" onPress={() => setOpen(false)}>Close</Button>
          </Column>
        </BasicAlertDialog>
      ) : null}
    </PreviewSection>
  );
}

export function ModalBottomSheetDemo() {
  const [open, setOpen] = useState(false);
  const ref = useRef<ModalBottomSheetRef>(null);
  return (
    <PreviewSection title="Sheet with a ref" description="Drag it down or tap outside to dismiss. The ref exposes hide, expand and partialExpand.">
      <Button variant="outlined" onPress={() => setOpen(true)}>Open bottom sheet</Button>
      {open ? (
        <ModalBottomSheet ref={ref} onDismissRequest={() => setOpen(false)} showDragHandle>
          <Column modifiers={[paddingAll(24)]} verticalArrangement={{ spacedBy: 12 }}>
            <Text variant="titleLarge">Bottom sheet</Text>
            <Button onPress={() => void ref.current?.expand()}>expand()</Button>
            <Button onPress={() => void ref.current?.hide().then(() => setOpen(false))}>hide()</Button>
          </Column>
        </ModalBottomSheet>
      ) : null}
    </PreviewSection>
  );
}

export function SnackbarHostDemo() {
  const host = useRef<SnackbarHostRef>(null);
  const styled = useRef<SnackbarHostRef>(null);
  const [result, setResult] = useState('-');
  return (
    <>
      <PreviewSection title="Show on demand" description="showSnackbar returns a promise that resolves with 'actionPerformed' or 'dismissed'.">
        <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
          <SnackbarHost ref={host} />
        </Host>
        <Button
          onPress={() =>
            void host.current?.showSnackbar({ message: 'Item archived', actionLabel: 'Undo', withDismissAction: true, duration: 'long' }).then(setResult)
          }>
          Show snackbar
        </Button>
        <StateRow text={`result=${result}`} />
      </PreviewSection>
      <PreviewSection title="Custom colors with Snackbar" description="Pass a Snackbar as a child of SnackbarHost to restyle the snackbar the host shows.">
        <Host matchContents={{ vertical: true }} style={{ alignSelf: 'stretch' }}>
          <SnackbarHost ref={styled}>
            <Snackbar containerColor="#4A148C" contentColor="#FFFFFF" actionContentColor="#FFEB3B" />
          </SnackbarHost>
        </Host>
        <Button variant="tonal" onPress={() => void styled.current?.showSnackbar({ message: 'Styled snackbar', actionLabel: 'OK' }).then(setResult)}>
          Show styled snackbar
        </Button>
      </PreviewSection>
    </>
  );
}

export function TooltipBoxDemo() {
  const plain = useRef<TooltipBoxRef>(null);
  return (
    <PreviewSection
      title="Plain and rich tooltips"
      description="Long-press the icons. The ref's show() and dismiss() work from JS."
      requires={['TooltipBoxView', 'PlainTooltipView', 'RichTooltipView']}>
      <Host matchContents>
        <Row horizontalArrangement={{ spacedBy: 16 }}>
          <TooltipBox ref={plain}>
            <TooltipBox.PlainTooltip><Text>Add to favorites</Text></TooltipBox.PlainTooltip>
            <IconButton><Icon source={ICONS.favorite} size={24} /></IconButton>
          </TooltipBox>
          <TooltipBox hasAction isPersistent>
            <TooltipBox.RichTooltip>
              <TooltipBox.RichTooltip.Title><Text>Rich tooltip</Text></TooltipBox.RichTooltip.Title>
              <TooltipBox.RichTooltip.Text><Text>Longer explanation with an action.</Text></TooltipBox.RichTooltip.Text>
              <TooltipBox.RichTooltip.Action><Button variant="text">Got it</Button></TooltipBox.RichTooltip.Action>
            </TooltipBox.RichTooltip>
            <IconButton><Icon source={ICONS.star} size={24} /></IconButton>
          </TooltipBox>
        </Row>
      </Host>
      <ActionButton label="plainTip.show()" tone="neutral" onPress={() => void plain.current?.show()} />
      <ActionButton label="plainTip.dismiss()" tone="neutral" onPress={() => void plain.current?.dismiss()} />
    </PreviewSection>
  );
}
