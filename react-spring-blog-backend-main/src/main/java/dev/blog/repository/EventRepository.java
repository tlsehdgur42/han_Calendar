package dev.blog.repository;

import dev.blog.entity.Event;
import dev.blog.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

//    // 제목으로 이벤트를 검색하는 메서드
//    Event findByTitle(String title);
//
//    // 특정 사용자의 참가 이벤트 목록을 페이지네이션하여 반환하는 메서드
//    Page<Event> findByParticipantsId(String userId, Pageable pageable);
//
//    // 특정 사용자의 이벤트 참가 혹은 생성 이벤트 목록을 페이지네이션하여 반환하는 메서드
//    Page<Event> findByCreatorIdOrParticipantsId(String userId, String userId1, Pageable pageable);
//
//    // 특정 사용자가 생성한 이벤트 목록을 페이지네이션하여 반환하는 메서드
//    Page<Event> findByCreatorId(int parseInt, Pageable pageable);

    @Query(value = "SELECT e FROM Event e JOIN FETCH e.member WHERE e.id = :eventID")
    Optional<Event> findByIdWithMember(Long eventID);

    // 특정 사용자 전체 일정
    List<Event> findByMember(Member member);

    // 특정 사용자 일정 조회
    Optional<Event> findByMemberIdAndId(Long memberId, Long eventId);

    void deleteByMemberIdAndId(Long memberId, Long eventId);

}
