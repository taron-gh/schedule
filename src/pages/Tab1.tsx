import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonDatetime, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar, ItemReorderEventDetail, useIonAlert } from '@ionic/react';
import './Tab1.css';
import * as icons from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Storage } from '@ionic/storage';


const Tab1: React.FC = () => {

  const store = new Storage();
  store.create();


  const [presentAlert] = useIonAlert();
  const d = new Date();

  /*
    {
      name:"",
      description: "",
      startTime: "",
      // endTime: "",
      text: ""
    }
  */

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    event.detail.complete();
  }


  const [selectedDay, setDay] = useState(d.getDay());
  const modal = useRef<HTMLIonModalElement>(null);
  const [schedule, setSchedule] = useState<any[][]>([
    [],
    [],
    [],
    [],
    [],
    [],
    []
  ]);
  const [name, setTaskName] = useState<string | number | undefined | null>("");
  const [description, setTaskDescription] = useState<string | number | undefined | null>("");
  const [startTime, setStartTime] = useState<string | number | undefined | null>(0);
  // const [endTime, setEndTime] = useState<string | number | undefined | null>(0);

  let isConfirmDisabled: boolean = true;
  if (name) {
    isConfirmDisabled = false;
  }

  function confirm() {
    modal.current?.dismiss({
      taskName: name,
      taskDescription: description,
      taskStartTime: startTime,
      // taskEndTime: endTime
    }, 'confirm');
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    console.log(ev.detail.data);

    if (ev.detail.role === 'confirm') {
      let newS: object[][];
      if (schedule[0]) {
        newS = [...schedule];
      } else {
        newS = [
          [],
          [],
          [],
          [],
          [],
          [],
          []
        ]
      }

      newS[selectedDay].push({
        name: ev.detail.data.taskName,
        description: ev.detail.data.taskDescription,
        startTime: ev.detail.data.taskStartTime,
        // endTime: ev.detail.data.taskEndTime
      });
      setSchedule(newS);

    }
  }

  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">Schedule</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>



        <IonSelect value={selectedDay} onIonChange={(e) => {
          console.log(e.target.value);

          setDay(e.target.value);

        }}>
          <IonSelectOption value={1}>Monday</IonSelectOption>
          <IonSelectOption value={2}>Tuesday</IonSelectOption>
          <IonSelectOption value={3}>Wednesday</IonSelectOption>
          <IonSelectOption value={4}>Thursday</IonSelectOption>
          <IonSelectOption value={5}>Friday</IonSelectOption>
          <IonSelectOption value={6}>Saturday</IonSelectOption>
          <IonSelectOption value={0}>Sunday</IonSelectOption>
        </IonSelect>


        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>
          {
            schedule[0] && schedule[selectedDay].map((elem, i) => {
              if (elem) {
                return <IonItem lines="none" key={i}>
                  <IonCard onClick={() =>
                    presentAlert({
                      header: 'Are you sure that you want to delete this task?',
                      buttons: [
                        {
                          text: 'Cancel',
                          role: 'cancel',
                          handler: () => { },
                        },
                        {
                          text: 'Yes',
                          role: 'confirm',
                          handler: () => {
                            let newS = [...schedule];
                            newS[selectedDay] = schedule[selectedDay].filter(function (value, index, arr) {
                              return index != i;
                            });
                            setSchedule(newS);
                          },
                        },
                      ]
                    })}>
                    <IonCardHeader>
                      <IonCardTitle></IonCardTitle>
                      <IonCardSubtitle>{elem.name} | {elem.startTime}</IonCardSubtitle>

                    </IonCardHeader>
                    {
                      elem.description && <IonCardContent>
                        {elem.description}
                      </IonCardContent>
                    }
                  </IonCard>
                  <IonReorder slot="end"></IonReorder>
                </IonItem>
              }

            })
          }
        </IonReorderGroup>

        <IonFab slot="fixed" vertical="bottom" horizontal="end" >
          <IonFabButton id="open-modal" onClick={() => {
            setTaskName("");
            setTaskDescription("");
            setStartTime(d.getHours() + ":" + d.getMinutes())
          }}>
            <IonIcon icon={icons.add}></IonIcon>
          </IonFabButton>
        </IonFab>


        <IonModal ref={modal} trigger="open-modal" onWillDismiss={(ev) => onWillDismiss(ev)}>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
              </IonButtons>
              <IonTitle>Add Task</IonTitle>
              <IonButtons slot="end">
                <IonButton strong={true} disabled={isConfirmDisabled} onClick={() => {
                  // setTaskName("");
                  // setTaskDescription("");
                  // setStartTime((new Date).getHours() + ":" + (new Date).getMinutes())
                  // console.log((new Date).getHours() + ":" + (new Date).getMinutes());
                  confirm();

                  // setEndTime((new Date).getHours() + ":" + (new Date).getMinutes())
                }}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Enter task name</IonLabel>
              <IonInput type="text" placeholder="Task name" value={name} onIonChange={(e) => {

                setTaskName(e.target.value)
              }} />

              <IonLabel position="stacked">Enter task description</IonLabel>
              <IonInput type="text" placeholder="Task description" value={description} onIonChange={(e) => { setTaskDescription(e.target.value) }} />

              <IonLabel position="stacked">Enter start time</IonLabel>
              <IonDatetime presentation='time' hourCycle='h23' onIonChange={(e) => {
                const dateFromIonDatetime = e.detail.value as string;
                let hour = format(parseISO(dateFromIonDatetime), 'H');
                let minute = format(parseISO(dateFromIonDatetime), 'm');
                hour = (hour as unknown as number) < 10 ? "0" + hour : hour;
                minute = (minute as unknown as number) < 10 ? "0" + minute : minute;
                console.log(hour + ":" + minute);
                setStartTime(hour + ":" + minute)
              }}></IonDatetime>

              {/* <IonLabel position="stacked">Enter end time</IonLabel>
              <IonDatetime presentation='time' hourCycle='h23' onIonChange={(e) => {
                const dateFromIonDatetime = e.detail.value as string;
                const hour = format(parseISO(dateFromIonDatetime), 'H');
                const minute = format(parseISO(dateFromIonDatetime), 'm');
                console.log(minute); // Jun 4, 2021
                setEndTime(hour + ":" + minute)
              }}></IonDatetime> */}

            </IonItem>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage >
  );
};

export default Tab1;
