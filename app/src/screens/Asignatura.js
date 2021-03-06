import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, AsyncStorage } from 'react-native';
import { Icon } from 'native-base';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';
import { HeaderBackButton } from 'react-navigation-stack';

import { WeekDays } from '../utils/getOrderedWeek';

import Colors from '../constants/colors';

import Card from '../components/base/Card';
import TextSeparator from '../components/base/TextSeparator';
import ColorPicker from '../components/asignatura/ColorPicker';
import ColorService from '../services/colorService';
import Notas from '../components/asignatura/Notas';

const styles = StyleSheet.create({
  header: {
    paddingBottom: 15,
    margin: 20,
    marginBottom: 0,
  },
  body: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  badge: {
    padding: 10,
    marginLeft: 20,
    borderRadius: 5,
    maxWidth: 100,
    zIndex: 10,
  },
  badgeText: {
    color: Colors.white,
    textTransform: 'uppercase',
    fontSize: 10,
    fontWeight: 'bold',
    width: '100%',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  title: {
    paddingBottom: 0,
    fontSize: 25,
    color: Colors.main,
  },
  subTitle: {
    fontSize: 16,
    color: Colors.strongGrey,
  },
  text: {
    color: Colors.main,
    fontSize: 18,
  },
  horario: {
    flexDirection: 'row',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 5,
    top: 0.8,
    marginRight: 10,
  },
  bodySubtitle: {
    color: Colors.main,
    paddingLeft: 5,
    fontSize: 16,
  },
  timeIcon: {
    color: Colors.main,
    fontSize: 14,
    top: 4,
  },
});
const RBSheetStyles = {
  wrapper: {
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: Colors.white2,
    borderTopEndRadius: 25,
    borderTopStartRadius: 25,
    shadowColor: Colors.main,
    shadowOffset: 2,
    elevation: 50,
  },
  draggableIcon: {
    backgroundColor: Colors.strongGrey,
  },
};

const AsignaturaScreen = ({ navigation }) => {
  const { asignatura } = navigation.state.params;
  const [color, setColor] = useState(asignatura.color);
  const [showNotas, setShowNotas] = useState(true);
  const firstUpdate = useRef(0);
  const refRBSheet = useRef();

  const handleColorChange = newColor => {
    // Se ejecuta cuando cambia el color en el ColorPicker;
    setColor(newColor);
    navigation.setParams({
      newColor: {
        id: asignatura._id,
        color,
      },
    });
  };

  const toggleVisibility = async () => {
    // Se ejecuta cuando cambia el color en el ColorPicker;
    const newBoolean = !showNotas;
    setShowNotas(newBoolean);
    await AsyncStorage.setItem(`visibility-${asignatura._id}`, newBoolean ? '1' : '');
  };

  useEffect(() => {
    const load = async () => {
      // get color
      const storedColor = await ColorService.getColor(asignatura._id);
      if (storedColor !== null) setColor(storedColor);
      else firstUpdate.current = 2;
      // get visibility
      const visibility = Boolean(
        await AsyncStorage.getItem(`visibility-${asignatura._id}`)
      );
      setShowNotas(visibility);
    };
    load();
  }, []);

  useEffect(() => {
    // Do not run on first change.
    if (firstUpdate.current <= 1) {
      firstUpdate.current += 1;
      return;
    }
    const saveColor = async () => {
      await ColorService.saveColor(asignatura._id, color);
    };
    saveColor();
  }, [color]);

  const colorEstado =
    asignatura.estado === 'Promovido' || asignatura.estado === 'Aprobado'
      ? Colors.green2
      : Colors.info;

  const getSchedule = a =>
    // eslint-disable-next-line implicit-arrow-linebreak
    a.dia
      .map(
        (day, i) =>
          // eslint-disable-next-line implicit-arrow-linebreak
          `${WeekDays[day]} (${asignatura.turno}) ${asignatura.hora[i]}hs a ${asignatura.horaT[i]}hs `
      )
      .join('y ');
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{asignatura.nombre}</Text>
        <View style={styles.subtitleContainer}>
          <TouchableOpacity
            style={[styles.dot, { backgroundColor: color }]}
            onPress={() => refRBSheet.current.open()}
          />
          <Text
            style={styles.subTitle}
          >{`${asignatura.courseId} - ${asignatura.curso}`}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text
          style={styles.text}
        >{`${asignatura.sede}  -  Aula: ${asignatura.aula}`}</Text>
        <View style={styles.horario}>
          <Icon name="access-time" type={'MaterialIcons'} style={styles.timeIcon} />
          <Text style={styles.bodySubtitle}>{getSchedule(asignatura)}</Text>
        </View>
      </View>
      {asignatura.estado !== 'Cursando' && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colorEstado,
            },
          ]}
        >
          <Text style={styles.badgeText}>{asignatura.estado}</Text>
        </View>
      )}
      <TextSeparator title="Resultado de Parciales">
        {asignatura.notas.length > 0 && (
          <TouchableOpacity
            onPress={toggleVisibility}
            style={{
              position: 'absolute',
              right: 20,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ color: Colors.strongGrey, fontSize: 12, letterSpacing: 0.5 }}>
              {showNotas ? 'HIDE' : 'SHOW'}
            </Text>
          </TouchableOpacity>
        )}
      </TextSeparator>
      {!(asignatura.notas.length > 0) ? (
        <Card message={'No hay notas registradas al día de la fecha.'} />
      ) : showNotas ? (
        <Notas notas={asignatura.notas} />
      ) : (
        <Card message={'Notas ocultas.'} icon={'visibility-off'} />
      )}

      {/* Color picker */}
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={RBSheetStyles}
      >
        <ColorPicker
          asignatura={asignatura}
          onColorClick={handleColorChange}
          selected={color}
        />
      </RBSheet>
    </View>
  );
};

AsignaturaScreen.navigationOptions = ({ navigation }) => ({
  headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
});

AsignaturaScreen.propTypes = {
  navigation: PropTypes.any,
};

export default AsignaturaScreen;
