import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonDatetime, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonReorder, IonReorderGroup, IonSelect, IonSelectOption, IonTitle, IonToolbar, ItemReorderEventDetail } from '@ionic/react';
import { OverlayEventDetail } from '@ionic/react/dist/types/components/react-component-lib/interfaces';
import { parseISO, format } from 'date-fns';
import { useRef, useState } from 'react';
import * as icons from 'ionicons/icons';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';

const Tab2: React.FC = () => {
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
  const [tasks, setTasks] = useState<any[]>([]);
  const [name, setTaskName] = useState<string | number | undefined | null>("");
  const [description, setTaskDescription] = useState<string | number | undefined | null>("");
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  function confirm() {
    modal.current?.dismiss({
      taskName: name,
      taskDescription: description,
      taskCompleted: isCompleted
    }, 'confirm');
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    console.log(ev.detail.data);

    if (ev.detail.role === 'confirm') {
      let newT: object[];
      if (tasks[0]) {
        newT = [...tasks];
      } else {
        newT = []
      }

      newT.push({
        name: ev.detail.data.taskName,
        description: ev.detail.data.taskDescription,
        isCompleted: ev.detail.data.taskIsCompleted,
      });
      setTasks(newT);

    }
  }

  return (
    <IonPage>
      <IonHeader collapse="condense">
        <IonToolbar>
          <IonTitle size="large">TODOs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>



        <IonReorderGroup disabled={false} onIonItemReorder={handleReorder}>

          {
            tasks[0] && tasks.map((elem, i) => {
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
                // setStartTime(hour + ":" + minute)
              }}></IonDatetime>

              <IonLabel position="stacked">Enter end time</IonLabel>
              <IonDatetime presentation='time' hourCycle='h23' onIonChange={(e) => {
                const dateFromIonDatetime = e.detail.value as string;
                const hour = format(parseISO(dateFromIonDatetime), 'H');
                const minute = format(parseISO(dateFromIonDatetime), 'm');
                console.log(minute); // Jun 4, 2021
                // setEndTime(hour + ":" + minute)
              }}></IonDatetime>

            </IonItem>
          </IonContent>
        </IonModal>

      </IonContent>
    </IonPage >
  );
};

export default Tab2;
