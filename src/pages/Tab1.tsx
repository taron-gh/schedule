import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonDatetime, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPage, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar, ItemReorderEventDetail } from '@ionic/react';
import './Tab1.css';
import * as icons from 'ionicons/icons';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';


const Tab1: React.FC = () => {
  const weekday = ["sunday", "monday", "wuesday", "wednesday", "thursday", "friday", "saturday"];

  const d = new Date();
  let day = weekday[d.getDay()];

  /*
    {
      name:"",
      description: "",
      startTime: "",
      endTime: "",
      text: ""
    }
  */

  function handleReorder(event: CustomEvent<ItemReorderEventDetail>) {
    console.log('Dragged from index', event.detail.from, 'to', event.detail.to);
    event.detail.complete();
  }



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
  const [endTime, setEndTime] = useState<string | number | undefined | null>(0);

  function confirm() {
    modal.current?.dismiss({
      taskName: name,
      taskDescription: description,
      taskStartTime: startTime,
      taskEndTime: endTime
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

      newS[d.getDay()].push({
        name: ev.detail.data.taskName,
        description: ev.detail.data.taskDescription,
        startTime: ev.detail.data.taskStartTime,
        endTime: ev.detail.data.taskEndTime
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



        <IonSelect value={day}>
          <IonSelectOption value="monday">Monday</IonSelectOption>
          <IonSelectOption value="tuesday">Tuesday</IonSelectOption>
          <IonSelectOption value="wednesday">Wednesday</IonSelectOption>
          <IonSelectOption value="thursday">Thursday</IonSelectOption>
          <IonSelectOption value="friday">Friday</IonSelectOption>
          <IonSelectOption value="saturday">Saturday</IonSelectOption>
          <IonSelectOption value="sunday">Sunday</IonSelectOption>
        </IonSelect>


        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>

          {
            schedule[0] && schedule[d.getDay()].map((elem, i) => {
              if (elem) {
                console.log(elem);

                // return <IonCard key={i}></IonCard>
                return <IonItem lines="none" key={i}>
                  <IonCard>
                  <IonCardHeader>
                    <IonCardTitle></IonCardTitle>
                    <IonCardSubtitle>{elem.name}</IonCardSubtitle>
                  </IonCardHeader>

                  <IonCardContent>
                    aa
                  </IonCardContent>
                </IonCard>
                  <IonReorder slot="end"></IonReorder>
                </IonItem>
              }

            })
          }



        </IonReorderGroup>

        <IonFab slot="fixed" vertical="bottom" horizontal="end" >
          <IonFabButton id="open-modal">
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
                <IonButton strong={true} disabled={false} onClick={() => confirm()}>
                  Confirm
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="stacked">Enter task name</IonLabel>
              <IonInput type="text" placeholder="Task name" value={name} onIonChange={(e) => { setTaskName(e.target.value) }} />

              <IonLabel position="stacked">Enter task description</IonLabel>
              <IonInput type="text" placeholder="Task description" value={description} onIonChange={(e) => { setTaskDescription(e.target.value) }} />

              <IonLabel position="stacked">Enter start time</IonLabel>
              <IonDatetime presentation='time' hourCycle='h23' onIonChange={(e) => {
                const dateFromIonDatetime = e.detail.value as string;
                const hour = format(parseISO(dateFromIonDatetime), 'H');
                const minute = format(parseISO(dateFromIonDatetime), 'm');
                console.log(minute); // Jun 4, 2021
                setStartTime(hour + ":" + minute)
              }}></IonDatetime>

              <IonLabel position="stacked">Enter end time</IonLabel>
              <IonDatetime presentation='time' hourCycle='h23' onIonChange={(e) => {
                const dateFromIonDatetime = e.detail.value as string;
                const hour = format(parseISO(dateFromIonDatetime), 'H');
                const minute = format(parseISO(dateFromIonDatetime), 'm');
                console.log(minute); // Jun 4, 2021
                setEndTime(hour + ":" + minute)
              }}></IonDatetime>

            </IonItem>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage >
  );
};

export default Tab1;
